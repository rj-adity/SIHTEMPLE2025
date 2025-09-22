import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users } from 'lucide-react';
import Button from '../../../components/ui/Button';
import AppImage from '../../../components/AppImage';

const TempleSelector = ({ temples, selectedTemple, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Select Your Temple</h2>
        <p className="text-muted-foreground">Choose from our network of connected temples</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temples?.map((temple, index) => (
          <motion.div
            key={temple?.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-card rounded-lg sacred-shadow overflow-hidden cursor-pointer transition-sacred ${
              selectedTemple?.id === temple?.id 
                ? 'ring-2 ring-sw1049-primary ring-offset-2 ring-offset-background' :'hover:sacred-shadow-lg'
            }`}
            onClick={() => onSelect(temple)}
          >
            {/* Temple Image */}
            <div className="relative h-48 overflow-hidden">
              <AppImage
                src={temple?.image}
                alt={temple?.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Capacity Badge */}
              <div className="absolute top-4 right-4 bg-temple-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="flex items-center space-x-1 text-white text-xs font-semibold">
                  <Users className="h-3 w-3" />
                  <span>{temple?.capacity}</span>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedTemple?.id === temple?.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 w-8 h-8 bg-success rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold">✓</span>
                </motion.div>
              )}
            </div>

            {/* Temple Details */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary mb-2">{temple?.name}</h3>
              
              <div className="flex items-center text-muted-foreground text-sm mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {temple?.location}
              </div>

              {/* Temple Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-temple-saffron mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Opens</p>
                  <p className="font-semibold text-sm">{temple?.openTime}</p>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-temple-red mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Closes</p>
                  <p className="font-semibold text-sm">{temple?.closeTime}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Ticket Prices</p>
                <div className="flex justify-between text-sm">
                  <span>Regular: ₹{temple?.ticketPrices?.regular}</span>
                  <span>VIP: ₹{temple?.ticketPrices?.vip}</span>
                </div>
              </div>

              {/* Select Button */}
              <Button
                onClick={(e) => {
                  e?.stopPropagation();
                  onSelect(temple);
                }}
                className={`w-full ${
                  selectedTemple?.id === temple?.id 
                    ? 'sw1049-gradient text-white' :'border-temple-gold hover:bg-temple-gold/10'
                }`}
                variant={selectedTemple?.id === temple?.id ? "default" : "outline"}
              >
                {selectedTemple?.id === temple?.id ? 'Selected' : 'Select Temple'}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Continue Button */}
      {selectedTemple && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-6"
        >
          <Button
            size="lg"
            className="sw1049-gradient text-white px-8 py-3 hover:opacity-90"
          >
            Continue to Date & Time Selection
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TempleSelector;