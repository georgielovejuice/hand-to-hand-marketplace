import Hashes from 'jshashes/hashes.js';

export default function hashPassword(str){
	return new Hashes.SHA256().hex(str);
}