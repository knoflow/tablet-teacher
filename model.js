// All Tomorrow's Parties -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Parties

/*
  Each party is represented by a document in the Parties collection:
    owner: user id
    x, y: Number (screen coordinates in the interval [0, 1])
    title, description: String
    public: Boolean
    invited: Array of user id's that are invited (only if !public)
    rsvps: Array of objects like {user: userId, rsvp: "yes"} (or "no"/"maybe")
*/
Desks = new Meteor.Collection('desks');
Slides = new Meteor.Collection('slides');
LiveSlides = new Meteor.Collection('liveSlides');

var AWAY = 1, IDLE = 2, ACTIVE = 3, SOLOED = 4;