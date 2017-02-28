
// converts 123.8  -> 1.23

export function formatBalance(n,decimals) {
  var sat = Math.floor(n);

  if (typeof decimals !== 'number')
    decimals = sat % 100 === 0 ? 0 : 2;

  return (sat/100).toFixed(decimals).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}


/*
  DO NOT DELETE!!!
 var fs = require('fs');
 const arr = require('fs').readdirSync('./public/img/chat-rooms');
 let output = []
 for (let i = 0; i < arr.length; i++) {
 let name = arr[i].slice(0,arr[i].length-4);
 output.push('{name: "'+ name +'", url: require("../../public/img/chat-rooms/'+arr[i]+'")}')
 }
 console.log(output);
 */

export const chatChannels = [
  {name: "spam", url: require("../../img/chat-rooms/spam.png")},
  {name: "vip", url: require("../../img/chat-rooms/vip.png")},
  {name: "arabic", url: require("../../img/chat-rooms/arabic.png")},
  {name: "armenian", url: require("../../img/chat-rooms/armenian.png")},
  {name: "bengali", url: require("../../img/chat-rooms/bengali.png")},
  {name: "bosnian", url: require("../../img/chat-rooms/bosnian.png")},
  {name: "bulgarian", url: require("../../img/chat-rooms/bulgarian.png")},
  {name: "chinese", url: require("../../img/chat-rooms/chinese.png")},
  {name: "croatian", url: require("../../img/chat-rooms/croatian.png")},
  {name: "czech", url: require("../../img/chat-rooms/czech.png")},
  {name: "danish", url: require("../../img/chat-rooms/danish.png")},
  {name: "dutch", url: require("../../img/chat-rooms/dutch.png")},
  {name: "english", url: require("../../img/chat-rooms/english.png")},
  {name: "estonian", url: require("../../img/chat-rooms/estonian.png")},
  {name: "farsi", url: require("../../img/chat-rooms/farsi.png")},
  {name: "filipino", url: require("../../img/chat-rooms/filipino.png")},
  {name: "finnish", url: require("../../img/chat-rooms/finnish.png")},
  {name: "french", url: require("../../img/chat-rooms/french.png")},
  {name: "german", url: require("../../img/chat-rooms/german.png")},
  {name: "greek", url: require("../../img/chat-rooms/greek.png")},
  {name: "hebrew", url: require("../../img/chat-rooms/hebrew.png")},
  {name: "hindi", url: require("../../img/chat-rooms/hindi.png")},
  {name: "hungarian", url: require("../../img/chat-rooms/hungarian.png")},
  {name: "indonesian", url: require("../../img/chat-rooms/indonesian.png")},
  {name: "italian", url: require("../../img/chat-rooms/italian.png")},
  {name: "korean", url: require("../../img/chat-rooms/korean.png")},
  {name: "norwegian", url: require("../../img/chat-rooms/norwegian.png")},
  {name: "polish", url: require("../../img/chat-rooms/polish.png")},
  {name: "portuguese", url: require("../../img/chat-rooms/portuguese.png")},
  {name: "romanian", url: require("../../img/chat-rooms/romanian.png")},
  {name: "russian", url: require("../../img/chat-rooms/russian.png")},
  {name: "serbian", url: require("../../img/chat-rooms/serbian.png")},
  {name: "slovak", url: require("../../img/chat-rooms/slovak.png")},
  {name: "slovenian", url: require("../../img/chat-rooms/slovenian.png")},
  {name: "spanish", url: require("../../img/chat-rooms/spanish.png")},
  {name: "swedish", url: require("../../img/chat-rooms/swedish.png")},
  {name: "thai", url: require("../../img/chat-rooms/thai.png")},
  {name: "turkish", url: require("../../img/chat-rooms/turkish.png")},
  {name: "ukrainian", url: require("../../img/chat-rooms/ukrainian.png")},
  {name: "vietnamese", url: require("../../img/chat-rooms/vietnamese.png")},
  {name: "help", url: require("../../img/chat-rooms/help.png")},

];

export let chatChannelsFlag = {};

for (let room of chatChannels) {
	chatChannelsFlag[room.name] = room.url;
}

export function validateUname(uname) {
  const allowedCharacters = /^[0-9a-zA-Z_\-]+$/;

	if (!uname)
		return 'Please enter a username.';

	if (uname.length < 3)
		return 'This is not a valid username. Usernames must have at least 3 characters.';

  if (!allowedCharacters.test(uname))
    return 'The username contains invalid characters. The valid characters for a username are letters, numbers, underscore(_) and hyphen(-).';

}

export function isAValidEmailAddress(emailAddress){
  return /^[a-z0-9_\-\.]{2,}@[a-z0-9_\-\.]{2,}\.[a-z]{2,}$/i.test(emailAddress);
}

export function randomPassword(length) {
  let chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNP23456789";
  let pass = "";
  for (let x = 0; x < length; x++) {
    let i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
}

// returns a reason, if it's invalid, otherwise it returns null
// amount is assumed to be from a text box, so it is always x100 of what
// it should be. (e.g. '1' gets treated as 100).
// minAmount (optional) is a number in satoshis. If no minAmount, it is
// assumed to be 100
export function isAmountInvalid(amount, minAmount, maxAmount) {

	if (amount === '')
		return 'You must enter an amount.';

	const isNumberRegex = /^[1-9]\d*$/; // handle against leading zeros

	if (!isNumberRegex.test(amount))
		return 'The amount should be a whole number.';

	amount = Number.parseFloat(amount) * 100;

	minAmount = minAmount === undefined ? 100 : minAmount;

	if (amount < minAmount)
		return 'The amount is too small';

	if (maxAmount && amount > maxAmount)
		return 'There\'s not enough balance';


	return null;
}

export function generateUuid() {
	let uuid = '';
	for (let i = 0; i < 32; i++) {
		const random = Math.random() * 16 | 0;

		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-'
		}
		uuid += (i === 12 ? 4 : (i === 16 ? ((random & 3) | 8) : random)).toString(16);
	}
	return uuid;
}


export function getAvatarColor(uname){
	let hash = 0;
	for (let i = 0; i < uname.length; i++) {
		hash = uname.charCodeAt(i) + ((hash << 5) - hash);
	}
	let c = (hash & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return "#00000".substring(0, 7 - c.length) + c;
}


export function validatePasscode(passcode) {

		if (!passcode)
			return 'Please enter the code from your Authenticator App.';

		if (passcode.length !== 6 )
			return 'The 2FA code should have 6 digits';

}

export function validatePassword(password) {
	if (!password)
		return 'Please enter your password.';
}

export function validateEmail(email) {
	if (!email)
		return 'Please enter an email.';

	if (!isAValidEmailAddress(email))
		return 'This does not look like a valid email.'
}

export function formatCurrency(currency, amount) {

	if(currency === "BALANCE")
		return amount ===  1 ?  'bit' : 'bits';

	console.assert(currency === 'VALOR'  || currency === 'SILVER');
	return currency.toLowerCase();
}