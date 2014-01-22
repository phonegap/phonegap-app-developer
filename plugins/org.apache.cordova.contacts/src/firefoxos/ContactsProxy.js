/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/ 

// somehow call this function by this:
// exec(success, fail, "Contacts", "save", [dupContact]);
// Cordova contact definition: 
// http://cordova.apache.org/docs/en/2.5.0/cordova_contacts_contacts.md.html#Contact
// FxOS contact definition:
// https://developer.mozilla.org/en-US/docs/Web/API/mozContact


var Contact = require('./Contact');
var ContactField = require('./ContactField');
var ContactName = require('./ContactName');


function createMozillaFromCordova(contact) {
    function exportContactFieldArray(contactFieldArray, key) {
        if (!key) {
            key = 'value';
        }                 
        var arr = [];
        for (var i=0; i < contactFieldArray.length; i++) {
            arr.push(contactFieldArray[i][key]);
        };                                       
        return arr;
    }              

    function exportAddress(addresses) {
        // TODO: check moz address format
        var arr = [];
        
        for (var i=0; i < addresses.length; i++) {
            var addr = {};
            for (var key in addresses[i]) {
                addr[key] = addresses[i][key];    
            } 
            arr.push(addr);
        }                                 
        return arr;
    } 

    function exportPhoneNumbers(phoneNumbers) {
        var mozNumbers = [];
        for (var i=0; i < phoneNumbers.length; i++) {
            var number = phoneNumbers[i];
            mozNumbers.push({
                type: number.type,
                value: number.value,
                pref: number.pref
            });
        }
        return mozNumbers;
    }

    // prepare mozContact object
    var moz = new mozContact();
    if (contact.id) {
        moz.id = contact.id;
    }
    // adding simple fields [contactField, eventualMozContactField]
    var arrayFields = [['givenName'], ['familyName'], ['displayName', 'name']];
    var simpleFields = [['honorificPrefix'], ['honorificSuffix'], ['nickname'], ['birthday', 'bday'], ['note']];
    j = 0; while(field = arrayFields[j++]) {
      if (contact.name[field[0]]) {
        moz[field[1] || field[0]] = contact.name[field[0]].split(' ');
      }
    }
    j = 0; while(field = simpleFields[j++]) {
      if (contact.name[field[0]]) {
        moz[field[1] || field[0]] = contact.name[field[0]];
      }
    }
    if (contact.emails) {
        moz.email = exportContactFieldArray(contact.emails);
    }
    if (contact.categories) {
        moz.category = exportContactFieldArray(contact.categories);
    }
    if (contact.addresses) {
        moz.adr = exportAddress(contact.addresses);
    }
    if (contact.phoneNumbers) {
        moz.tel = exportPhoneNumbers(contact.phoneNumbers);
    }
    if (contact.organizations) {
        moz.org = exportContactFieldArray(contact.organizations, 'name');
        moz.jobTitle = exportContactFieldArray(contact.organizations, 'title');
    }
    /*  Find out how to translate these parameters
        // photo: Blob
        // url: Array with metadata (?)
        // impp: exportIM(contact.ims), TODO: find the moz impp definition
        // anniversary
        // sex
        // genderIdentity
        // key
    */
    return moz;
}

function createCordovaFromMozilla(moz) {
    function exportPhoneNumbers(mozNumbers) {
        var phoneNumbers = [];
        for (var i=0; i < mozNumbers.length; i++) {
            var number = mozNumbers[i];
            phoneNumbers.push(
                new ContactField( number.type, number.value, number.pref));
        }
        return phoneNumbers;
    }

    var contact = new Contact();

    if (moz.id) {
        contact.id = moz.id;
    }
    var arrayFields = [['givenName'], ['familyName'], ['name', 'displayName']];
    var simpleFields = [['honorificPrefix'], ['honorificSuffix'], ['nickname'], ['bday', 'birthday'], ['note']];
    var name = new ContactName();
    var j = 0; while(field = arrayFields[j++]) {
      if (moz[field[0]]) {
        name[field[1] || field[0]] = moz[field[0]].join(' ');
      }
    }
    j = 0; while(field = simpleFields[j++]) {
      if (moz[field[0]]) {
        name[field[1] || field[0]] = moz[field[0]];
      }
    }
    contact.name = name;
    // emails
    // categories
    // addresses
    if (moz.tel) {
        contact.phoneNumbers = exportPhoneNumbers(moz.tel);
    }
    // organizations
    return contact;
}


function saveContacts(successCB, errorCB, contacts) {
    // a closure which is holding the right moz contact
    function makeSaveSuccessCB(moz) {
        return function(result) {
            // create contact from FXOS contact (might be different than
            // the original one due to differences in API)
            var contact = createCordovaFromMozilla(moz);
            // call callback
            successCB(contact);
        }
    }
    var i=0;
    var contact;
    while(contact = contacts[i++]){
        var moz = createMozillaFromCordova(contact);
        var request = navigator.mozContacts.save(moz);
        // success and/or fail will be called every time a contact is saved
        request.onsuccess = makeSaveSuccessCB(moz);
        request.onerror = errorCB;                
    }
}   


function remove(successCB, errorCB, ids) {
    var i=0;
    var id;
    for (var i=0; i < ids.length; i++){
        var moz = new mozContact();
        moz.id = ids[i];
        var request = navigator.mozContacts.remove(moz);
        request.onsuccess = successCB;
        request.onerror = errorCB;
    }
}


var mozContactSearchFields = ['name', 'givenName', 'additionalName', 
    'familyName', 'nickname', 'email', 'tel', 'jobTitle', 'note'];

// function search(successCB, errorCB, params) {
//     var options = params[1] || {}; 
//     var filter = [];
//     // filter out inallowed fields
//     for (var i=0; i < params[0].length; i++) {
//         if (mozContactSearchFields.indexOf([params[0][i]])) {
//             filter.push(params[0][i]);
//         } else if (params[0][i] == 'displayName') {
//             filter.push('name');
//         } else {
//             console.log('FXOS ContactProxy: inallowed field passed to search filtered out: ' + params[0][i]);
//         }
//     }
// 
//     var request;
//     // TODO find out how to handle searching by numbers
//     // filterOp: The filter comparison operator to use. Possible values are 
//     //           equals, startsWith, and match, the latter being specific 
//     //           to telephone numbers.
//     var mozOptions = {filterBy: filter, filterOp: 'startsWith'};
//     if (!options.multiple) {
//         mozOptions.filterLimit = 1;
//     }
//     if (!options.filter) {
//         // this is returning 0 contacts
//         request = navigator.mozContacts.getAll({});
//     } else {
//         // XXX This is searching for regardless of the filterValue !!!
//         mozOptions.filterValue = options.filter;
//         console.log('mozoptions: filterBy: ' + mozOptions.filterBy.join(' ') + '; fiterValue: ' + mozOptions.filterValue);
//         request = navigator.mozContacts.find(mozOptions);
//     }
//     request.onsuccess = function() {
//         var contacts = [];
//         var mozContacts = request.result;
//         for (var i=0; i < mozContacts.length; i++) {
//             contacts.push(createCordovaFromMozilla(mozContacts[i]));
//         }
//         successCB(contacts);
//     };
//     request.onerror = errorCB;
// }


/* navigator.mozContacts.find has issues - using getAll 
 * https://bugzilla.mozilla.org/show_bug.cgi?id=941008
 */
function hackedSearch(successCB, errorCB, params) {
    // [contactField, eventualMozContactField]
    var arrayFields = ['givenName', 'familyName', 'name'];
    var options = params[1] || {}; 
    var filter = [];
    // filter out inallowed fields
    for (var i=0; i < params[0].length; i++) {
        if (mozContactSearchFields.indexOf([params[0][i]])) {
            filter.push(params[0][i]);
        } else if (params[0][i] == 'displayName') {
            filter.push('name');
        } else {
            console.log('FXOS ContactProxy: inallowed field passed to search filtered out: ' + params[0][i]);
        }
    }
    var getall = navigator.mozContacts.getAll({});
    var contacts = [];

    function isValid(mozContact) {
        if (!options.filter) {
            // get all
            return true;
        }
        for (var j=0; j < filter.length; j++) {
            var field = filter[0];
            var value = (arrayFields.indexOf(field) >= 0) ? mozContact[field].join(' ') : mozContact[field];
            if (value.indexOf(options.filter) >= 0) {
                return true;
            }
        }
    }
    getall.onsuccess = function() {
        if (getall.result) {
            if (isValid(getall.result)) {
                contacts.push(createCordovaFromMozilla(getall.result));
            }
            
            getall.continue();
            
        } else {
            successCB(contacts);
        }

    };
    getall.onerror = errorCB;
}

module.exports = {
    save: saveContacts,
    remove: remove,
    search: hackedSearch
};    
    
require("cordova/firefoxos/commandProxy").add("Contacts", module.exports); 
