/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class OptionModel {
    @Property()
    public Key: string;

    @Property()
    public Description:string;

    @Property()
    public Value: string;

    @Property()
    public Comment: string;

}
