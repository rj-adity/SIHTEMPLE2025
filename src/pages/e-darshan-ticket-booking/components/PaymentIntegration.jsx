import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, Lock, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentIntegration = ({ bookingData, onPaymentMethodSelect, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState(bookingData?.paymentMethod || 'upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // method, details, processing, success

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Pay using Google Pay, PhonePe, Paytm, etc.',
      color: 'temple-green',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay accepted',
      color: 'temple-gold'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks supported',
      color: 'temple-saffron'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay, Mobikwik',
      color: 'sw1049-primary'
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    onPaymentMethodSelect(methodId);
  };

  const handlePaymentProcess = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentStep('success');
    setIsProcessing(false);
    
    // Complete payment after showing success
    setTimeout(() => {
      onPaymentComplete();
    }, 2000);
  };

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods?.map((method, index) => {
          const IconComponent = method?.icon;
          const isSelected = selectedMethod === method?.id;
          
          return (
            <motion.div
              key={method?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-sacred ${
                isSelected
                  ? `border-${method?.color} bg-${method?.color}/10`
                  : 'border-border hover:border-temple-gold hover:bg-temple-gold/5'
              }`}
              onClick={() => handleMethodSelect(method?.id)}
            >
              {/* Popular Badge */}
              {method?.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-temple-green text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 text-white" />
                </motion.div>
              )}
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-lg bg-${method?.color}/20 flex items-center justify-center mr-3`}>
                  <IconComponent className={`h-5 w-5 text-${method?.color}`} />
                </div>
                <h4 className="font-bold text-primary">{method?.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{method?.description}</p>
            </motion.div>
          );
        })}
      </div>

      <Button
        onClick={() => setPaymentStep('details')}
        disabled={!selectedMethod}
        size="lg"
        className="w-full sw1049-gradient text-white hover:opacity-90"
      >
        Continue to Payment Details
      </Button>
    </div>
  );

  const renderPaymentDetails = () => {
    const selectedMethodInfo = paymentMethods?.find(m => m?.id === selectedMethod);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-muted rounded-full px-6 py-3 mb-4">
            {selectedMethodInfo && (
              <>
                <selectedMethodInfo.icon className={`h-5 w-5 text-${selectedMethodInfo?.color}`} />
                <span className="font-semibold">{selectedMethodInfo?.name}</span>
              </>
            )}
          </div>
        </div>
        {selectedMethod === 'upi' && (
          <div className="bg-card rounded-lg p-6 sacred-shadow">
            <div className="text-center space-y-4">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-sm text-muted-foreground">QR Code</p>
                  <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Or pay using UPI ID</p>
                <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                  temple@sw1049-upi
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedMethod === 'card' && (
          <div className="bg-card rounded-lg p-6 sacred-shadow space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" className="font-mono" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <Input placeholder="Name as on card" />
              </div>
            </div>
          </div>
        )}
        {selectedMethod === 'netbanking' && (
          <div className="bg-card rounded-lg p-6 sacred-shadow">
            <div>
              <label className="block text-sm font-medium mb-2">Select Your Bank</label>
              <select className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-sw1049-primary/20 focus:border-sw1049-primary">
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="other">Other Banks</option>
              </select>
            </div>
          </div>
        )}
        {selectedMethod === 'wallet' && (
          <div className="bg-card rounded-lg p-6 sacred-shadow">
            <div className="grid grid-cols-2 gap-4">
              {['Paytm', 'Amazon Pay', 'Mobikwik', 'Freecharge']?.map(wallet => (
                <button
                  key={wallet}
                  className="p-4 border border-border rounded-lg hover:border-temple-gold hover:bg-temple-gold/5 transition-sacred"
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-temple-gold/20 rounded mx-auto mb-2"></div>
                    <span className="text-sm font-medium">{wallet}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setPaymentStep('method')}
            className="flex-1 border-temple-gold hover:bg-temple-gold/10"
          >
            Back
          </Button>
          
          <Button
            onClick={handlePaymentProcess}
            className="flex-1 sw1049-gradient text-white hover:opacity-90"
          >
            Pay ₹{bookingData?.totalAmount?.toLocaleString()}
          </Button>
        </div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-temple-gold border-t-transparent rounded-full mx-auto"
      />
      
      <div>
        <h3 className="text-xl font-bold text-primary mb-2">Processing Payment</h3>
        <p className="text-muted-foreground">Please wait while we process your payment...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Amount: ₹{bookingData?.totalAmount?.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-temple-gold/10 border border-temple-gold/30 rounded-lg p-4">
        <p className="text-sm text-temple-gold">
          🔒 Your payment is secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="h-10 w-10 text-white" />
      </motion.div>
      
      <div>
        <h3 className="text-2xl font-bold text-success mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">Your e-darshan booking has been confirmed</p>
        <p className="text-sm text-muted-foreground mt-2">
          Redirecting to booking confirmation...
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {paymentStep === 'success' ? 'Payment Complete' : 'Secure Payment'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {paymentStep === 'method' && 'Choose your preferred payment method'}
          {paymentStep === 'details' && 'Enter your payment details'}
          {paymentStep === 'processing' && 'Processing your secure payment'}
          {paymentStep === 'success' && 'Your booking has been confirmed'}
        </p>
        
        {paymentStep !== 'success' && (
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success rounded-full px-4 py-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-semibold">256-bit SSL Secured</span>
          </div>
        )}
      </div>
      {/* Payment Content */}
      <div className="bg-card rounded-lg sacred-shadow p-6">
        {paymentStep === 'method' && renderPaymentMethodSelection()}
        {paymentStep === 'details' && renderPaymentDetails()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'success' && renderSuccess()}
      </div>
      {/* Booking Summary */}
      {paymentStep !== 'success' && bookingData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-temple-saffron/10 to-temple-gold/10 rounded-lg p-6 border border-temple-gold/30"
        >
          <h4 className="font-semibold text-primary mb-4">Payment Summary</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temple:</span>
              <span className="font-medium">{bookingData?.temple?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-medium">
                {bookingData?.selectedDate?.toLocaleDateString()} at {bookingData?.timeSlot}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tickets:</span>
              <span className="font-medium">
                {bookingData?.numberOfTickets} × {bookingData?.ticketType}
              </span>
            </div>
            
            <div className="border-t border-temple-gold/30 pt-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">Total Amount:</span>
                <span className="text-xl font-bold text-temple-saffron">
                  ₹{bookingData?.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentIntegration;