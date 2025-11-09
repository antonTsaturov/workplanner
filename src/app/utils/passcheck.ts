export const weakPasswordPatterns = {
    // Too short (less than 8 characters)
    tooShort: /^.{1,7}$/,
    
    // No uppercase letters
    noUppercase: /^[^A-Z]+$/,
    
    // No lowercase letters  
    noLowercase: /^[^a-z]+$/,
    
    // No numbers
    noNumbers: /^\D+$/,
    
    // No special characters
    noSpecial: /^[a-zA-Z0-9]*$/,
    
    // Common weak passwords
    commonPasswords: /^(?:123456|password|admin|qwerty|abc123|letmein|welcome|monkey|password1|123456789|12345678|12345|1234567|sunshine|password123|admin123|welcome123|login|passw0rd|master|hello|freedom|whatever|qwerty123|zaq1zaq1|baseball|dragon|superman|trustno1|princess|ashley|shadow|football|mustang|access|1qaz2wsx|123qwe|starwars|photoshop|michael|jordan|pass|aaaaaa|loveme|hello123|solo|hunter|fuckyou|charlie|secret|george|merlin|midnight|computer|corona|qwertyuiop|asdfghjkl|zxcvbnm|111111|123123|1234|123|1|12|1234567890|000000|555555|11111111|7777777|666666|888888|999999|121212|159753|789456|123654|123321|112233|1234567|987654321|12345678910|qwe123|1q2w3e4r|1q2w3e|qweasd|qwerty1|password12|password1234|p@ssw0rd|p@ssword|pass123|pass@123|admin@123|welcome1|welcome12|welcome1234|test123|demo123|sample123|temp123|changeme|default|guest|user|root|administrator|sql|oracle|mysql|database|server|system|info|data|file|backup|config|setup|security|network|internet|web|www|http|ftp|email|mail|contact|support|help|service|login123|signin|register|auth|authentication|oauth|api|token|key|secretkey|private|public|local|remote|dev|development|test|testing|stage|staging|prod|production|live|demo|sample|temp|temporary|backup|old|new|current|previous|next|first|last|admin1|admin2|user1|user2|test1|test2|demo1|demo2|temp1|temp2|backup1|backup2|root123|guest123|user123|admin1234|user1234|test1234|demo1234|temp1234|backup1234)$/i,
    
    // Sequential characters
    sequential: /(?:123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
    
    // Repeated characters
    repeated: /(.)\1{2,}/,
    
    // Keyboard patterns
    keyboardPatterns: /(?:qwerty|qwertyuiop|asdfgh|zxcvbn|qazwsx|edcrfv|tgbyhn|yhnujm|ikm,ol|p;'\[\]|\]';\?\/\\|1qaz|2wsx|3edc|4rfv|5tgb|6yhn|7ujm|8ik,|9ol.|0p;'|qwer|asdf|zxcv|poiu|lkjh|mnbv)/i
};
