import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, QrCode, Download, Share2, Edit, CheckCircle, Navigation, Star, Gift, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import BookingManagementHeader from './components/BookingManagementHeader';
import LiveTempleUpdates from './components/LiveTempleUpdates';
import TicketManagementCard from './components/TicketManagementCard';
import NavigationAssistance from './components/NavigationAssistance';
import VisitPreparationChecklist from './components/VisitPreparationChecklist';
import AdditionalServicesBooking from './components/AdditionalServicesBooking';
import BookingModificationModal from './components/BookingModificationModal';
import FeedbackSubmissionModal from './components/FeedbackSubmissionModal';

const BookingConfirmationManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock booking data - in real app this would come from API
  const bookingData = {
    id: 'SW1049123456',
    temple: {
      name: 'Dwarkadhish Temple',
      location: 'Dwarka, Gujarat',
      image: '/api/placeholder/400/300',
      contact: '+91-2892-234567',
      gpsCoords: { lat: 22.2587, lng: 68.9678 }
    },
    date: new Date(Date.now() + 86400000), // Tomorrow
    timeSlot: '10:00 AM',
    tickets: 3,
    ticketType: 'VIP Darshan',
    amount: 600,
    status: 'confirmed',
    devotees: [
      { name: 'Rahul Sharma', age: 35 },
      { name: 'Priya Sharma', age: 32 },
      { name: 'Aarav Sharma', age: 8 }
    ],
    paymentStatus: 'completed',
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  };

  const [liveUpdates, setLiveUpdates] = useState({
    crowdLevel: 'medium',
    waitTime: 25,
    weatherStatus: 'clear',
    specialAnnouncements: [
      'Special Aarti at 6:00 PM today',
      'Prasadam distribution starts at 12:00 PM'
    ],
    serviceDisruptions: []
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => ({
        ...prev,
        waitTime: Math.max(10, prev?.waitTime + Math.floor(Math.random() * 10) - 5),
        crowdLevel: ['low', 'medium', 'high']?.[Math.floor(Math.random() * 3)]
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'reminder',
        title: 'Visit Reminder',
        message: 'Your darshan is scheduled for tomorrow at 10:00 AM',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'update',
        title: 'Crowd Update',
        message: 'Current wait time reduced to 25 minutes',
        time: '30 minutes ago',
        read: false
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const tabConfig = [
    { id: 'overview', label: 'Overview', icon: Ticket },
    { id: 'live-updates', label: 'Live Updates', icon: RefreshCw },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'preparation', label: 'Preparation', icon: CheckCircle },
    { id: 'services', label: 'Services', icon: Gift }
  ];

  const handleTicketDownload = async () => {
    // Import the PDF generator dynamically to avoid issues
    const { downloadTicketPDF } = await import('../../utils/pdfGenerator');
    await downloadTicketPDF(bookingData);
  };

  const handleBookingShare = async () => {
    const shareData = {
      title: 'E-Darshan Booking',
      text: `Darshan booked at ${bookingData?.temple?.name} on ${bookingData?.date?.toLocaleDateString()}`,
      url: window.location?.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(`${shareData?.text} - ${shareData?.url}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <TicketManagementCard 
              bookingData={bookingData}
              onDownload={handleTicketDownload}
              onShare={handleBookingShare}
              onModify={() => setShowModifyModal(true)}
            />
            <LiveTempleUpdates 
              updates={liveUpdates}
              temple={bookingData?.temple}
            />
          </div>
        );

      case 'live-updates':
        return (
          <LiveTempleUpdates 
            updates={liveUpdates}
            temple={bookingData?.temple}
            detailed={true}
          />
        );

      case 'navigation':
        return (
          <NavigationAssistance 
            temple={bookingData?.temple}
            bookingDate={bookingData?.date}
          />
        );

      case 'preparation':
        return (
          <VisitPreparationChecklist 
            bookingData={bookingData}
          />
        );

      case 'services':
        return (
          <AdditionalServicesBooking 
            temple={bookingData?.temple}
            bookingData={bookingData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      {/* Header */}
      <BookingManagementHeader 
        bookingData={bookingData}
        notifications={notifications}
        onNotificationRead={(id) => {
          setNotifications(prev => 
            prev?.map(n => n?.id === id ? { ...n, read: true } : n)
          );
        }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Booking Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-lg border-2 ${
            bookingData?.status === 'confirmed' ?'bg-success/10 border-success text-success' :'bg-warning/10 border-warning text-warning'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6" />
              <div>
                <h3 className="font-bold">Booking Confirmed</h3>
                <p className="text-sm opacity-80">
                  Your darshan is scheduled for {bookingData?.date?.toLocaleDateString()} at {bookingData?.timeSlot}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6" />
              <span className="font-mono font-bold">{bookingData?.id}</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
            {tabConfig?.map(tab => {
              const IconComponent = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-sacred whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-sw1049-primary text-white' :'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-card rounded-lg sacred-shadow p-6"
        >
          <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={handleTicketDownload}
              className="flex flex-col items-center space-y-2 h-auto py-4 border-temple-gold hover:bg-temple-gold/10"
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Download Tickets</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleBookingShare}
              className="flex flex-col items-center space-y-2 h-auto py-4 border-temple-saffron hover:bg-temple-saffron/10"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Share Booking</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowModifyModal(true)}
              className="flex flex-col items-center space-y-2 h-auto py-4 border-temple-green hover:bg-temple-green/10"
            >
              <Edit className="h-5 w-5" />
              <span className="text-xs">Modify Booking</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowFeedbackModal(true)}
              className="flex flex-col items-center space-y-2 h-auto py-4 border-sw1049-primary hover:bg-sw1049-primary/10"
            >
              <Star className="h-5 w-5" />
              <span className="text-xs">Share Feedback</span>
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Modals */}
      <BookingModificationModal 
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        bookingData={bookingData}
      />
      <FeedbackSubmissionModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        bookingData={bookingData}
      />
    </div>
  );
};

export default BookingConfirmationManagement;