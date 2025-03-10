const emailTemplates = {
  EM01: {
    subject: "Rent-a-car Password Reset",
    body: `We have just received a password reset request for <user’s email address>. 
        
  Please click here to reset your password.  
  
  For your security, the link will expire in 24 hours or immediately after you reset your password.`,
  },
  EM02: {
    subject: "Your car has been booked",
    body: `Congratulations! Your car <Name of car> has been booked at DD/MM/YYYY HH:MM.  
        
  Please go to your wallet to check if the deposit has been paid and go to your car’s details page to confirm the deposit.  
        
  Thank you!`,
  },
  EM03: {
    subject: "A booking with your car has been cancelled",
    body: `Please be informed that a booking with your car <Name of car> has been cancelled at DD/MM/YYYY HH:MM.  
        
  The deposit will be returned to the customer’s wallet.`,
  },
  EM04: {
    subject: "Your car has been returned",
    body: `Please be informed that your car <Name of car> has been returned at DD/MM/YYYY HH:MM.  
        
  Please go to your wallet to check if the remaining payment has been paid and go to your car’s details page to confirm the payment.  
  
  Thank you!`,
  },
  EM05: {
    subject: "There’s an update to your wallet.",
    body: `Please be informed that your wallet’s balance has been updated at DD/MM/YYYY HH:MM.  
        
  Please go to your wallet and view the transactions for more details.  
  
  Thank you!`,
  },
};

export default emailTemplates;
