const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

var admin = require('firebase-admin');
const Transactions = require("./models/transactions");
const Customer = require("./models/customer");
const Length = require("./models/length");
const DebitCredit = require("./models/debitCredit");
const Reports = require("./models/reports");
// const asdffdsa = require("./models/lastIdUsed");
const Orders = require('./models/Orders');
const ItemsName = require('./models/itemsName');
const Accounts = require('./models/accounts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var serviceAccount = require("./serviceAccountKey.json");
const {firestore} = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://work-5bc8a.firebaseio.com"
});

var db = admin.firestore();
let customerLength;
let idToUse;
let lastIdUsedDate;
today = new Date();
if (String(today.getMonth() + 1).length == 1) {
    modiMonth = '0' + String(today.getMonth() + 1)
} else {
    modiMonth = String(today.getMonth() + 1)
}
if (String(today.getDate()).length == 1) {
    modiDate = '0' + String(today.getDate() + 1)
} else {
    modiDate = String(today.getDate())
}
// mongodb+srv://damon:qwert123@cluster0.qyevd.mongodb.net/anilDeriyaJwellers?retryWrites=true
// mongodb://localhost:27017/
// 
date = (String(today.getFullYear()) + '-' + modiMonth + '-' + modiDate);
mongoose
    .connect(
        "mongodb+srv://damon:qwert123@cluster0.qyevd.mongodb.net/anilDeriyaJwellers?retryWrites=true",
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
// listenFCus();
// listenFOrders();

// 1
app.post("/api/transactions", async (req, res) => {
        const transactions = new Transactions({
            itemName: req.body.itemName,
            weight: req.body.weight,
            principle: req.body.principle,
            roi: req.body.roi,
            issueDate: date,
            cusId: req.body.cusId,
            returned: false

        });
        transactions.save();
        res.status(201).json({
            message: 'Post added successfully'
        });
        postOrders('T');
        cusTran(req.body.cusId);
});
// 2
// todo add response
app.post("/api/customer", async (req, res) => {
    if (req.body._Id !== -1) {
        console.log("113", req.body);

        Customer.findOneAndUpdate({_id: req.body._Id}, {
            $set: {
                name: req.body.name,
                fname: req.body.fname,
                mobNum: req.body.mobNum,
                village: req.body.village,
                caste: req.body.caste,
            }
        }).then(console.log("customerUpdated"))
    } else {
        let length;
        await Length.findOne({_id: 2}).then(async (documents) => {
            length = documents.length;
            documents.length = length + 1;
            documents.save();
        }).then(console.log("customer length updates"));
        const customer = new Customer({
            _id: length,
            name: req.body.name,
            fname: req.body.fname,
            mobNum: req.body.mobNum,
            village: req.body.village,
            caste: req.body.caste,
            transactions: []
        });

        customer.save().then(console.log("customer saved"));
    }


});

// 3
//todo use $addToSet
function cusTran(uid) {

    Customer.findOne({_id: uid}).then(async (customer) => {
        customer.transactions.push(this.idToUse)
        customer.save()
    });

}

// 4
//todo  make api to get.
app.post("/api/posts", (req, res) => {
    console.log(req.body);
    Arr = req.body
    if (Arr[0] == "rep") {

        Transactions.find({$and: [{returnDate: {$gte: Arr[1]}}, {returnDate: {$lte: Arr[2]}}]}, {
            "profit": 1,
            "returnDate": 1,
            "cusId": 1
        }).sort({returnDate: 1}).then(documents => {
            res.status(200).json({
                transactions: documents
            });
        });
    }//
    else {
        let lesser = Arr[0];
        let greater = Arr[1];
        console.log(Arr[0], Arr[1]);
        Transactions.find({$and: [{issueDate: {$gte: Arr[0]}}, {issueDate: {$lte: Arr[1]}}]}).then(documents => {
            console.log(documents);
            res.status(200).json({
                transactions: documents
            });
        })
    }

});
// 5
// 6
//TODO  refractor
app.get("/api/reports", (req, res) => {
    Reports.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            Reports: documents
        });

    });
});
// 7
app.post("/api/getCustomer", (req, res) => {
    Arr = req.body
    if (Arr.length == 0) {
        // TODO remove transactions array (add select)
        // TODO add pagination
        Customer.find().then(documents => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                customer: documents
            });
        });
    } else {

        Customer.find({_id: Arr[0]}).then(documents => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                customer: documents
            });

        });
    }

});
// todo add api to give search suggestions on customer name

// 8
// todo add pagination
app.post("/api/getdebitCredit", (req, res) => {
    // console.log(req.body[0],req.body[1]);
    if (req.body.length == 2) {
        DebitCredit.find({$and: [{date: {$gte: req.body[0]}}, {date: {$lte: req.body[1]}}]}).then(documents => {
            // console.log(documents);
            res.status(200).json({
                message: "Posts fetched successfully!",
                debitCredit: documents
            });
        })

    } else {
        DebitCredit.find().then(documents => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                debitCredit: documents
            });
        });
    }

});
// 9
// todo add pagination
app.post("/api/rtd", (req, res) => {
    if (req.body == []) {
        Transactions.find().then(documents => {
            res.status(200).json({
                message: "returnedTransaction successfully!",
                returnedTransaction: documents
            });

        });
    } else if (req.body[0] == "forRtd") {
        Transactions.find({$and: [{returnDate: {$gte: req.body[1]}}, {returnDate: {$lte: req.body[2]}}]}).then(documents => {
            console.log(documents);
            res.status(200).json({
                returnedTransaction: documents
            });
        })
    }

});
// 10
// todo add response
app.post("/api/addToItemsName", (req, res) => {
    console.log("line 274", req.body.element);
    ItemsName.update({_id: 0}, {$push: {itemsName: req.body.element}}).then(console.log("itemname added"))
});
// 11
// todo make get,
app.post("/api/indiTrans", (req, res) => {

    Transactions.find({'_id': req.body}).then(transactions => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            transactions: transactions
        });
    });
});
// 12
// todo refactor
app.post("/api/return", async (req, res) => {

    Transactions.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            profit: req.body.profit,
            returnDate: date,
            returned: true
        }
    })
        .then(transactions => {
            console.log("line 297 Done return");
        });
    res.status(201).json({
        message: 'return updated successfully'
    });

})
// 13
/** add a debit credit */
app.post("/api/debitCredit", async (req, res) => {
    const debitCredit = new DebitCredit({
        amount: req.body.amount,
        date: date,
        description: req.body.description,
    });

    debitCredit.save();
    res.status(201).json({
        message: 'Post added successfully'
    });
    postOrders('DC');
})
// 14
/*** Updating todayProfit,thisMonth profit, main bal etc*/
app.post("/api/mainBal", async (req, res) => {
    Reports.updateOne({_id: 1}, {$set: {transactions: req.body}}, {upsert: true}).then(result => {
    });
    res.status(201).json({
        message: 'Post added successfully'
    });
})
// 15
app.post("/api/addToReports", async (req, res) => {
    Reports.updateOne({_id: 1}, {$set: {transactions: req.body}}, {upsert: true}).then(console.log("done"))
    res.status(201).json({
        message: 'profit added successfully'
    });
})
//16
// app.post("/api/orders", (req, res) => {// finds order
//     // console.log(req.body[0],req.body[1]);
//
//     Orders.find({$and: [{date: {$gte: req.body[0]}}, {date: {$lte: req.body[1]}}]}).sort({_id: 1}).then(documents => {
//         // console.log(documents);
//         res.status(200).json({
//             message: "Posts fetched successfully!",
//             orders: documents
//         });
//     });
//
// });

//17
// function postOrders(T) {
//     let main_bal;
//
//     // first().then(()=> {
//     if (this.lastIdUsedDate != this.date) {
//         One();
//     } else {
//         Two();
//     }
//
//     function One() {
//         inOne().then(() => {
//             inTwo()
//         })
//
//         function inOne() {
//
//             return promise2 = new Promise((res, rej) => {
//                 Reports.find().then(document => {
//                     main_bal = document[0].transactions[6]
//                     console.log(main_bal);
//                     res();
//                 })
//             })
//         }
//
//         async function inTwo() {
//
//             const order = new Orders({
//                 _id: Number(id),//
//                 date: date,
//                 T: T,
//                 main_bal: main_bal,
//                 approved: false
//             });
//             order.save();
//         }
//     }
//
//     async function Two() {
//         const order = new Orders({
//             _id: Number(id),//req.body._Id also gives id (hv to remove it)
//             date: this.date,
//             T: T,
//             approved: false
//         });
//
//         order.save();
//
//     }
// }

//18
app.get("/api/newTrId", (req, res) => { // after adding new tr, to add tr-id into cus-Tr arr without reloading
    res.status(200).json({
        Id: this.idToUse,
    });
});
//19
app.get("/api/getItemsName", (req, res) => {
    ItemsName.find().then((document) => {
        res.status(200).json({
            itemsName: document[0].itemsName
        });
    })
});


/*function listenFCus() { //listen firebase customer
  const doc = db.collection('customer').orderBy("_id","desc").limit(1);
  const observer = doc.onSnapshot(docSnapshot => {
    docSnapshot.forEach(doc => {
      Length.find({_id:2}).then((document)=>{
        if (document[0].length!=doc.data()._id+1) {
          customer = new Customer (doc.data());
          customer.save();
        Length.updateOne( {_id:2} ,{$inc:{length:1}},{upsert:true}).then(console.log("L"))
        }
  })
  });
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}*/
//20
/*function listenFOrders() {
 const doc = db.collection('type_of_transaction').orderBy("_id","desc").limit(1);
 const observer = doc.onSnapshot(docSnapshot => {
   docSnapshot.forEach(doc => {
     asdffdsa.find({_id:0}).then((document)=>{
       console.log("line 445",document[0].ID,doc.data()._id+1);
       if (document[0].ID!=doc.data()._id+1) {
     let order = new Orders (doc.data());
     order.save();
   asdffdsa.updateOne( {_id:0} ,{$inc:{ID:1}},{upsert:true}).then(console.log("L"))

     if (doc.data().T==='T') {
       sync_Tran_F_to_L();
     }else if(doc.data().T==='R'){
       sync_RTran_F_to_L();
     }else if(doc.data().T==='DC'){
       sync_DC_F_to_L();
     }
   }
   })

 });

 }, err => {
   console.log(`Encountered error: ${err}`);
 });

}*/
/*
  async function sync_Tran_F_to_L() {
    const citiesRef = db.collection('transactions');
    const snapshot = await citiesRef.orderBy('_id','desc').limit(1).get();
    Transactions.insertMany(snapshot.docs.map(doc => doc.data())).then(console.log("Transactions inserted"))
    snapshot.forEach(doc => {
      Customer.findOne({_id:Number(doc.data().cusId)}).then((customer)=>{
          customer.transactions.push(doc.data()._id)
          const customers = new Customer(customer);
          customers.save().then(console.log("done"));
      })
      
    });
  }
  async function sync_DC_F_to_L() {
    const citiesRef = db.collection('debitCredit');
    const snapshot = await citiesRef.orderBy('_id','desc').limit(1).get();
    DebitCredit.insertMany(snapshot.docs.map(doc => doc.data())).then(console.log("DB inserted"));
  }
  async function sync_RTran_F_to_L() {
    console.log("line 491");
    const citiesRef = db.collection('transactions');
    const snapshot = await citiesRef.orderBy('rid','desc').limit(1).get();
    snapshot.forEach(doc => {
      // console.log(doc.data());
      Transactions.updateOne({_id:doc.data()._id},{$set:{profit:doc.data().profit, returnDate: doc.data().returnDate, returned: true}},{upsert:true}).then(console.log("tUpdated"))
    });
    
  }*/

//
app.get("/api/getAccounts", (req, res) => {
    console.log("533");

    Accounts.find().then((accounts) => {
        console.log(accounts);
        res.status(200).json({
            "accounts": accounts
        });
    })
});

app.get("/api/approveIt", (req, res) => {

});


module.exports = app;

