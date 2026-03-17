import {faker} from '@faker-js/faker'

export class RandomDataUtils{
    
    static getFirstName(){
        return faker.person.firstName();
    }
    
    static getLastName(){
        return faker.person.lastName();
    }

    static getEmail(){
        return faker.internet.email();
    }

    static getPhoneNumber(){
        return faker.phone.number();
    }
    
    static getPassword(){
        return faker.internet.password();
    }

}