import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, Calendar, Clock, MapPin, Users, QrCode, Mail, MessageSquare } from 'lucide-react';
import Button from '../../../components/ui/Button';

const BookingConfirmation = ({ bookingData }) => {
  const [showQR, setShowQR] = useState(false);
  const ticketRef = useRef(null);

  const bookingId = `SW1049${Date.now()?.toString()?.slice(-6)}`;
  const qrData = `${bookingId}|${bookingData?.temple?.id}|${bookingData?.selectedDate?.toISOString()}|${bookingData?.timeSlot}`;

  const handleDownload = () => {
    // Simulate ticket download
    const element = document.createElement('a');
    const ticketData = {
      bookingId,
      temple: bookingData?.temple?.name,
      date: bookingData?.selectedDate?.toLocaleDateString(),
      time: bookingData?.timeSlot,
      tickets: bookingData?.numberOfTickets,
      type: bookingData?.ticketType,
      amount: bookingData?.totalAmount,
      devotee: bookingData?.devoteeDetails?.primaryDevotee?.name
    };
    
    const file = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `e-darshan-ticket-${bookingId}.json`;
    document.body?.appendChild(element);
    element?.click();
    document.body?.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'E-Darshan Ticket Booked',
          text: `Successfully booked darshan at ${bookingData?.temple?.name} for ${bookingData?.selectedDate?.toLocaleDateString()}`,
          url: window.location?.href
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(`E-Darshan Booking Confirmed! Booking ID: ${bookingId}`);
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(bookingData?.selectedDate);
    const [hours, minutes] = (bookingData?.timeSlot || '10:00')?.split(':');
    startDate?.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate?.setHours(startDate?.getHours() + 1);

    const event = {
      title: `Darshan at ${bookingData?.temple?.name}`,
      start: startDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z',
      end: endDate?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z',
      description: `E-Darshan booking - ID: ${bookingId}`,
      location: bookingData?.temple?.location
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event?.title)}&dates=${event?.start}/${event?.end}&details=${encodeURIComponent(event?.description)}&location=${encodeURIComponent(event?.location)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Success Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 25 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-10 w-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-success mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-4">
          Your e-darshan tickets have been successfully booked
        </p>
        
        <div className="inline-flex items-center space-x-2 bg-success/10 text-success rounded-full px-6 py-3">
          <span className="text-lg font-bold">🎫</span>
          <span className="font-bold">Booking ID: {bookingId}</span>
        </div>
      </div>
      {/* Digital Ticket */}
      <motion.div
        ref={ticketRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-temple-saffron/10 via-white to-temple-gold/10 rounded-2xl p-8 sacred-shadow-lg border-2 border-temple-gold/30 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-temple-gold/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-temple-saffron/20 rounded-full translate-y-12 -translate-x-12" />

        {/* Ticket Header */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">E-Darshan Ticket</h3>
              <p className="text-temple-gold font-semibold">Team SW1049 • Digital Pass</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
              className="bg-temple-gold/20 rounded-lg p-3"
            >
              <QrCode className="h-6 w-6 text-temple-gold" />
            </motion.button>
          </div>

          {/* QR Code Modal */}
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20"
              onClick={() => setShowQR(false)}
            >
              <div className="text-center">
                <div className="w-48 h-48 bg-black rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-white text-xs">QR Code</div>
                </div>
                <p className="text-sm text-muted-foreground">Scan at temple entrance</p>
                <p className="text-xs text-muted-foreground mt-1">Tap anywhere to close</p>
              </div>
            </motion.div>
          )}

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-temple-saffron mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Temple</p>
                  <p className="font-bold text-primary">{bookingData?.temple?.name}</p>
                  <p className="text-xs text-muted-foreground">{bookingData?.temple?.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-temple-gold mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-bold text-primary">
                    {bookingData?.selectedDate?.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-temple-red mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-bold text-primary">{bookingData?.timeSlot}</p>
                  <p className="text-xs text-temple-green">Report 15 minutes early</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-sw1049-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Tickets</p>
                  <p className="font-bold text-primary">
                    {bookingData?.numberOfTickets} × {bookingData?.ticketType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Primary: {bookingData?.devoteeDetails?.primaryDevotee?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-temple-gold/10 rounded-lg p-4 border border-temple-gold/30">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount Paid</span>
              <span className="text-2xl font-bold text-temple-saffron">
                ₹{bookingData?.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 bg-temple-green hover:bg-temple-green/90 text-white"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>

        <Button
          onClick={handleShare}
          variant="outline"
          className="flex items-center justify-center space-x-2 border-temple-gold hover:bg-temple-gold/10"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>

        <Button
          onClick={handleAddToCalendar}
          variant="outline"
          className="flex items-center justify-center space-x-2 border-temple-saffron hover:bg-temple-saffron/10"
        >
          <Calendar className="h-4 w-4" />
          <span>Add to Calendar</span>
        </Button>

        <Button
          onClick={() => window.location.href = '/booking-confirmation-management'}
          className="flex items-center justify-center space-x-2 sw1049-gradient text-white hover:opacity-90"
        >
          <Users className="h-4 w-4" />
          <span>Manage Booking</span>
        </Button>
      </motion.div>
      {/* Important Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-lg sacred-shadow p-6"
      >
        <h4 className="font-semibold text-primary mb-4 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Important Instructions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Carry valid photo ID matching the booking name</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Show QR code at temple entrance for quick entry</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Arrive 15 minutes before your time slot</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Follow temple dress code and guidelines</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Confirmation SMS sent to registered mobile number</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-temple-green">✓</span>
              <span>Contact temple directly for any modifications</span>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center bg-muted/30 rounded-lg p-4"
      >
        <p className="text-sm text-muted-foreground mb-2">
          Need help? Contact our support team
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4 text-temple-gold" />
            <span>Chat Support</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4 text-temple-saffron" />
            <span>support@sw1049.com</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingConfirmation;