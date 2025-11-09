import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/minilibrary';

const userSchema = new mongoose.Schema({ username: String, password: String, role: String });
const User = mongoose.model('User', userSchema, 'users');

async function run(){
  await mongoose.connect(uri);
  const users = await User.find({});
  let migrated = 0;
  for(const u of users){
    if(typeof u.password === 'string' && !u.password.startsWith('$2')){
      const hash = await bcrypt.hash(u.password, 10);
      u.password = hash;
      await u.save();
      migrated++;
      console.log(`Migrated user ${u.username}`);
    }
  }
  console.log(`Done. Migrated: ${migrated}`);
  await mongoose.disconnect();
}

run().catch(err=>{ console.error(err); process.exit(1); });
