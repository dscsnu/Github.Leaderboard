import { Meteor } from 'meteor/meteor';
import { CronJob } from 'cron';
import { Participants } from '../models/participants';
import { baseTimeStamp } from '../../config';
import fetch, { Headers } from 'node-fetch';
import config from '../../config';

const perPerson = async person => {
    let {username, lastContrib, commits, prs} = person;
    lastContrib = typeof(lastContrib) === 'number' ? lastContrib : 0;
    try {
        let events = [];

        for(let i = 1; i <= 10; i++)
        {
            let temp = await fetch(
                `https://api.github.com/users/${username}/events?page=${i}`,
                {
                    headers: new Headers({
                        'Authorization': `token ${config.githubAccessToken}`
                    })
                }
            );
            temp = await temp.json();
            events = [...events, ...temp];
            if(temp.length > 0 && Date.parse(temp[temp.length - 1].created_at) < lastContrib)
            break;
        }

        let firstPushEvent = events.find(event => ((event.type === 'PushEvent') && (Date.parse(event.created_at)>baseTimeStamp)));
        
        //New Commits by user
        let newCommits = events.filter(event => Date.parse(event.created_at) > lastContrib);
        newCommits = newCommits.length == 0 ? [] : newCommits.reduce((val, elem) => {
            if(typeof(val) === 'number')
            {
                let temp = elem.type === 'PushEvent' ? elem.payload.commits.length : 0;
                return val + temp;
            }
            else
            {
                let temp1 = val.type === 'PushEvent' ? val.payload.commits.length : 0;
                let temp2 = elem.type === 'PushEvent' ? elem.payload.commits.length : 0;
                return temp1 + temp2;
            }
        });
        let newPRs = events.filter(event => (event.type === 'PullRequestEvent' && event.payload && event.payload.action && event.payload.action === 'opened')).length;
        let output = Participants.update(
            { username : username },
            { 
                $set: {
                    lastContrib: ( events[0] && Date.parse( events[0].created_at )) || lastContrib || 0,
                    commits: ( commits && ( commits + newCommits )) || 0,
                    prs: ( prs && ( prs + newPRs )) || 0
                } 
            }
        );
    }
    catch(e){
        console.log(e);
    }
}

const updateData = async () => {
    const participantsList = Participants.find({}).fetch();
    console.log(participantsList);
    for(part in participantsList)
    {
        await perPerson(participantsList[part]);
    }
}

Meteor.startup(() => {
    new CronJob({
        cronTime: '00 00 00 * * *',
        // use this wrapper if you want to work with mongo:
        onTick: updateData,
        start: true,
        timeZone: 'Asia/Kolkata',
    });
    updateData();
});