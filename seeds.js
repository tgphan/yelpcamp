var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require("./models/comment");
var seeds = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg",
        description: "Veniam ad non magna fugiat veniam ea id fugiat aliqua in proident aliqua ex. Incididunt velit eu do excepteur veniam fugiat consequat anim. In in elit ea veniam Lorem. Sit irure aute sit aliqua dolore. Eu incididunt irure deserunt nisi pariatur esse est adipisicing veniam occaecat officia cupidatat. Excepteur quis ipsum et enim exercitation aliquip dolor aliquip in commodo mollit amet."
    },
    {
        name: "Desert Mesa",
        image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929_960_720.jpg",
        description: "Quis ipsum id ad deserunt qui eiusmod minim. Nulla magna proident ullamco quis occaecat veniam excepteur ad commodo. Sit sit magna consequat laborum quis culpa enim aliqua cillum fugiat aliquip. Ipsum sit duis esse cillum dolor duis dolor ea anim. Non dolore id incididunt do dolore quis deserunt et aliqua. Aliquip proident ea duis quis quis ut esse in ut nulla consectetur proident."
    },
    {
        name: "Kenyan Floor",
        image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_960_720.jpg",
        description: "Cupidatat officia in consectetur irure mollit magna ut velit eu reprehenderit ullamco excepteur laborum. Ad ex pariatur in cillum in quis magna anim veniam laboris voluptate aliqua. Duis qui cillum fugiat commodo eiusmod amet consequat cupidatat duis ea cillum non qui. Et id magna dolore Lorem aliquip eu est fugiat aute anim. Aliqua nisi exercitation velit ut exercitation dolor consectetur exercitation esse anim. Incididunt labore ut labore officia labore irure sit eiusmod elit excepteur ea. Anim voluptate sunt incididunt cupidatat cupidatat dolore deserunt."
    }
]

async function seedDB() {
    try {
        //Remove all campgrounds
        await Campground.deleteMany({});
        console.log('Campgrounds removed!');
        await Comment.deleteMany({});
        console.log('Comments removed');
        //add a few campgrounds
        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log('Campground created');
            let comment = await Comment.create(
                {
                    text: "This place is great but I wish there was internet",
                    author: "Homer"
                }
            );
            console.log('Created new comment');
            campground.comments.push(comment);
            campground.save();
            console.log('Comment added to campground');
        }
    } catch(err) {
        console.log(err);
    }
}



//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("added a campground");
//                 Comment.create(
//                     {
//                         text: "This place is great but I wish there was internet",
//                         author: "Homer"
//                     }, (err, comment) => {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             campground.comments.push(comment);
//                             campground.save();
//                             console.log('Created new comment');
//                         }
//                     });
//             }
//         });
//     });
// }
module.exports = seedDB;