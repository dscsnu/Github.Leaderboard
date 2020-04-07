import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Participants = new Mongo.Collection('participants');

const Leaderboard = React.memo(({ participants }) => {
    console.log(participants);
    return (
        <table>
            <tbody>
                <tr>
                    <td>Rank</td>
                    <td>Username</td>
                    <td>Pull Requests</td>
                    <td>Commits</td>
                </tr>
                {
                    participants
                    .sort((a, b) => {
                        if(a.prs > b.prs)
                            return 1;
                        else if(b.prs > a.prs)
                            return -1;
                        else if(a.commits > b.commits)
                            return 1;
                        else if(b.commits > a.commits)
                            return -1;
                        else
                            return 0;
                    })
                    .map((person, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{person.username}</td>
                            <td>{person.prs}</td>
                            <td>{person.commits}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
});

export default withTracker(() => {
    return {
        participants: Participants.find({}).fetch()
    };
})(Leaderboard);