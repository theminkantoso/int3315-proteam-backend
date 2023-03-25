import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ldap, { Client, SearchOptions } from 'ldapjs';
import { createWinstonLogger } from 'src/common/services/winston.service';

@Injectable()
export class LdapService {
  constructor(private readonly configService: ConfigService) {}
  private ldapClient: Client;
  private readonly logger = createWinstonLogger(
    'ldap-client',
    this.configService,
  );

  createLdapClient(url: string): boolean {
    try {
      this.ldapClient = ldap.createClient({
        url: [url],
      });
      this.ldapClient.on('error', () => {
        return false;
      });
      return true;
    } catch (error) {
      this.logger.error('Error in createLdapClient service', error);
      return false;
    }
  }

  bind(username: string, password: string, callback: (error) => void) {
    if (this.ldapClient) {
      this.ldapClient.bind(username, password, callback);
    }
  }

  searchUsers(ldapBaseUsersDN: string, callback, errorCallback) {
    const opts: SearchOptions = {
      filter: '(uid=*)',
      scope: 'sub',
    };

    this.ldapClient.search(ldapBaseUsersDN, opts, (err, res) => {
      const listLdapUsers = [];
      if (err) {
        this.logger.error('Error in ldap service searchUsers', err);
        throw err;
      } else {
        res.on('searchEntry', function (entry) {
          listLdapUsers.push({
            ldapDn: entry.object.dn,
            email: entry.object.email,
            ldapUsername: entry.object.sn,
            firstName: entry.object.givenName,
            lastName: entry.object.cn,
            password: entry.object.userPassword,
            countryCode: entry.object.c,
          });
        });
        res.on('error', (err) => {
          this.logger.error('Error in ldap service searchUsers error', err);
          errorCallback(err);
        });
        res.on('end', function () {
          callback(listLdapUsers);
        });
      }
    });
  }

  unbind() {
    if (this.ldapClient) this.ldapClient.unbind();
  }
}
