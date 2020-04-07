import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Participants = new Mongo.Collection("participants");

//Do not allow updation from client
Meteor.methods({
    'participants.insert'(text){
        throw new Meteor.Error('not-authorized');
    },
    'participants.update'(text){
        throw new Meteor.Error('not-authorized');
    },
    'participants.delete'(text){
        throw new Meteor.Error('not-authorized');
    },
    'participants.remove'(text){
        throw new Meteor.Error('not-authorized');
    }
})