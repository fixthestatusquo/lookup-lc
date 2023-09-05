import { Level } from "level";
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const db = new Level('./emails.db', { valueEncoding: 'json' });

interface Record {
  email: null | string;
}

interface  Err {
      code: string;
    notFound: boolean;
    status: number;
};


const deleteHash = () => {

  const h = ['e2a771f259dea6e7dfd2dbfc7ec98f93fec2e5c1c2846a50d1d0f8204bb32fcfa52a2001be1b8b99a4eb86e2372df860f761166d3a83f793724257d5c202dcd5',
  'ea656162e91e86f4ecdecc5678d724a7c0a1d34b2d4fa34972b3d773feb69033a27ec4783b2e29ebad480b0d01d7054efc877034be0fedf64b15d99c0c70ce79',
  '44251b9c0767c1183798eb03db7c1ced870b4c753827784a24766c001915a3a2ce8fdceb4345b5cb8907a36344f0ab5ad28053573867e48708fa8cac88c64a75',
  '8005bd131bf4881c3f6d052cd2ad349e7ba58b7a14efd63c8b7248dec820214dc609c395efe48458bc91243fcb8fe04bf64fc43366e8f1e170184a50dfa761bd',
  '3584827e58402e175cc37b5cdab3e929ee21706b834ba71acce0b7b551b9bad58d29895b0eb12d2c84fdc821bf3f11f76e4edd87081b6ef39e95b2db5af24e9f',
  '2a7526156c9a4b4a122bb4b2833901f4d7c48fb7cdac1c7f889b182a923c7a964aabd22c21d9c87f03c8e5a20d739eb813978be78fb87f6748aca3bc1574390e',
  'ecce64a0ac934bb7da0ce05a9d9cd8c0eafad3ec823e6dc5449f9cc6e2d4c711f8cf618ae9904246baa3df19e9c21c318d8f554322098c7aa40881c033ef4b46',
  'a1f8d08f74301261725330221b7f04e99deb7f1254e5d75669e4bf00346f317829126750826c11a88e8f822ad56f5c88784580eac8f6eae4020290ff20c39757',
  '18512bd2e71757886e566511fb8e7fddd73d6c5b4a9f3695f367a84ce3375b8dc1a089c4731a0d04d63ff41b820b80e68fbcb0a069ce1ba306d171da57886789',
  '68779944790df64bbcfa2d30cce5a98a0a8f5c2e4f87c7ff4b2512b9776b18baaa7870da39dfe4143713bbc593ff2648bef0627ea09311437f2a962d0386dc96',
  'c262e7a3fc36b649b581b47c2522ce1cf2e5dcf208995965806c91d7283a3569e462835cd274ddc2637c60c5f5b9c7d08f68629653b837c1a4e8103548a1f724',
  '08f3413acde167a22ca15b0dece969c73b30c00970f99f5c64df2d545f7f70aa01fb14dc3fcad68431617f4eb906d1bc7ebf03232e533b71c0d9859135f1d4bd',
  '826293bf48e6f8b7dee5b561712847f3673878bf1c9e816d4ac6906c2af0d9a69daf68742e8350c093955fe3ca9c4a52dfa6643325e6d54f9f53bf6add0752fa',
  '80b3e149cea8ac25b598438000cf3e43f6fc37f20cbf581b2cce5f3c05819bfc3a25bfd9aedb8ff27fecd61fba0dcb11c2c84b715f68c87a7f61253a76959536',
  'a27acc2bb86908cad51ce73cf360ba9d02d7946e753b7d39fca69339f14ecd34e12cb7f81534682961fa872043ee96d3cb055921e40b015b942291aa65d49f17',
  '59c604b920adf58bfa6d28e8e4858af641cd13c87d4ae8b8442a9357e4791bef66a6b8d2cc5cfd4be67e30cec18a09396db52ebe4c0a0ffe1ff90927ae512efc',
  '322f1a12fa22cda3fea473d515b58a344304aee4024be38fd039ac40649dac2e3bbbd6082bb8bb0d7c125280d28975d48cc6b129973a5e8a6c920ea3d58e025d',
  '092d2276d98a5fc750b6fa8d64f22b3b1a484ce6faf8a67f0870e79c706fc31724e038d1e9a2a7a603a341d503cb22c112927831c2b175557e071a2f2b7aa014',
  '93118ed5821c5fc36e6bea1829f1a0a0d519a0dec9f9fc449a090f4e566ba38f756dfd816d884b28a0e7be1a7dd10d66835e56601d70ea513195d32f8b6e18ed',
  'afc6ed0f5837a3a5fef54afd0c0424a3497faa6ff15cfa753e7807d029a011745f89dcbe9858818535639e6192415b0c9348f5c62d8163cc0e63f508056b3100',
  '2ad48911f4d9eb4c28e50e93fc5b08da1fc23904c969100fbae2f93fcd66a74d5d27f12b1bdcfadfb92dd332c69605aa32d7fec1779c1a51fc00879a1966bfe5',
  '87a049cb39bea4f68104194fa0c78b55a4ad5b00f3c648b863f6397fd69bf9b0e5be43a3e6296f2cb962a38c4a22ce43582fd602673d05d8e4e01ba6481759dc'
  ]

h.map(async (j) => {
  console.log("deleting", j, crypto.createHmac("sha256", j))
  await db.del(j);
})
  console.log("Deleted")
}

const fetchHashes = async () => {
  if (!process.env.EMAILS_URL) {
    console.error("Missing URL env variable");
    return;
  }
  const url = process.env.EMAILS_URL;
  try {
    const { data, status } = await axios.get(url, makeHeaders());
    console.log("Status:", status);
    console.log("data", data, typeof data);
    return data;
  } catch (error) {
    console.log(error);
  }
}


const fetch1 = async () => {

  // deleteHash();
   const data = await fetchHashes();
    try {
      const _x = await db.get(data[i]);
     } catch (e) {
       const error = e as Err;
       if (error.notFound) {
         console.log("save hash ", data[i])
         await db.put<string, Record>(data[i], { email: null }, {})



       } else {
         console.error("Aww, something went wrong", error)
       }
     }
};


const email = 'robin.halfkann@lobbycodddssntrol.de';
const h = crypto.createHash('sha512').update(process.env.TRUST_SALT + ":" + email).digest('hex');


const lookup = async (email: string) => {
  const hash = crypto.createHash('sha512').update(process.env.TRUST_SALT + ":" + email).digest('hex');
  try {
    await db.get(hash);
    console.log("oo")
    return true;
  } catch (_error) {
    const error = _error as Err;
    if (error.notFound) {
console.log("aaa")
      return false;
    } else {
      console.error("Aww, something went wrong", error)
      throw error;
    }
  }
}

export const fetch = async () => {

 // deleteHash();
  const data = await fetchHashes();
  console.log("data", data);

  for (const i in data) {
    try {
      const _x = await db.get(data[i]);
      //console.log(_x);
    } catch (e) {
      const error = e as Err;
      if (error.notFound) {
        console.log("save hash ", data[i])
        await db.put<string, Record>(data[i], { email: null }, {})
        const s = await db.get(data[i]);
        console.log("yay", s)



      } else {
        console.error("Aww, something went wrong", error)
      }
    }
  }
};

//fetch();

lookup(email);

