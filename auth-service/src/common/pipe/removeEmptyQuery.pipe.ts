import { PipeTransform, Injectable } from '@nestjs/common';
import trim from 'lodash/trim';
import mapKeys from 'lodash/mapKeys';
import isArray from 'lodash/isArray';

type QueryType =
    | string
    | number
    | number[]
    | string[]
    | Record<string, string | number>
    | Record<string, string | number>[];

@Injectable()
export class RemoveEmptyQueryPipe implements PipeTransform {
    constructor() {
        //
    }
    removeEmptyValue(query: QueryType): void {
        const removeEmpty = (item: any) => {
            mapKeys(item, (value, key) => {
                // remove null, undefined, empty
                if (value !== 0 && !value) {
                    delete item[key];
                }
                // remove string contain only space characters
                else if (typeof value === 'string' && !trim(value as string)) {
                    delete item[key];
                }

                // iterate array
                else if (isArray(value)) {
                    value.forEach((property, index) => {
                        // remove null, undefined, empty
                        if (!property) {
                            value.splice(index, 1);
                        }

                        // remove string contain only space characters
                        else if (
                            typeof property === 'string' &&
                            !trim(property as string)
                        ) {
                            value.splice(index, 1);
                        }
                    });
                }
            });
        };

        removeEmpty(query);
    }

    transform(query: QueryType) {
        this.removeEmptyValue(query);
        return query;
    }
}
