import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DevoteeDetailsForm = ({ numberOfTickets, devoteeDetails, onDetailsSubmit }) => {
  const [formData, setFormData] = useState({
    primaryDevotee: {
      name: devoteeDetails?.primaryDevotee?.name || '',
      phone: devoteeDetails?.primaryDevotee?.phone || '',
      email: devoteeDetails?.primaryDevotee?.email || '',
      age: devoteeDetails?.primaryDevotee?.age || '',
      address: devoteeDetails?.primaryDevotee?.address || ''
    },
    additionalDevotees: devoteeDetails?.additionalDevotees || Array.from({ length: numberOfTickets - 1 }, () => ({
      name: '',
      age: ''
    }))
  });

  const [errors, setErrors] = useState({});

  const handlePrimaryDevoteeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      primaryDevotee: {
        ...prev?.primaryDevotee,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors?.[`primary_${field}`]) {
      setErrors(prev => ({ ...prev, [`primary_${field}`]: null }));
    }
  };

  const handleAdditionalDevoteeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalDevotees: prev?.additionalDevotees?.map((devotee, i) => 
        i === index ? { ...devotee, [field]: value } : devotee
      )
    }));

    // Clear error when user starts typing
    if (errors?.[`additional_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`additional_${index}_${field}`]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Primary devotee validation
    if (!formData?.primaryDevotee?.name?.trim()) {
      newErrors.primary_name = 'Name is required';
    }
    if (!formData?.primaryDevotee?.phone?.trim()) {
      newErrors.primary_phone = 'Phone number is required';
    } else if (!/^\d{10}$/?.test(formData?.primaryDevotee?.phone?.replace(/\D/g, ''))) {
      newErrors.primary_phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData?.primaryDevotee?.email?.trim()) {
      newErrors.primary_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.primaryDevotee?.email)) {
      newErrors.primary_email = 'Please enter a valid email address';
    }
    if (!formData?.primaryDevotee?.age?.trim()) {
      newErrors.primary_age = 'Age is required';
    } else if (isNaN(formData?.primaryDevotee?.age) || parseInt(formData?.primaryDevotee?.age) < 1) {
      newErrors.primary_age = 'Please enter a valid age';
    }

    // Additional devotees validation
    formData?.additionalDevotees?.forEach((devotee, index) => {
      if (!devotee?.name?.trim()) {
        newErrors[`additional_${index}_name`] = 'Name is required';
      }
      if (!devotee?.age?.trim()) {
        newErrors[`additional_${index}_age`] = 'Age is required';
      } else if (isNaN(devotee?.age) || parseInt(devotee?.age) < 1) {
        newErrors[`additional_${index}_age`] = 'Please enter a valid age';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onDetailsSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Devotee Details</h2>
        <p className="text-muted-foreground mb-4">
          Please provide details for all devotees
        </p>
        <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
          <User className="h-4 w-4 text-temple-saffron" />
          <span className="font-semibold">{numberOfTickets} Devotee{numberOfTickets > 1 ? 's' : ''}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Devotee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg sacred-shadow p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <User className="mr-2 h-5 w-5 text-sw1049-primary" />
            Primary Devotee (Booking Contact)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                value={formData?.primaryDevotee?.name}
                onChange={(e) => handlePrimaryDevoteeChange('name', e?.target?.value)}
                placeholder="Enter full name"
                className={errors?.primary_name ? 'border-error' : ''}
              />
              {errors?.primary_name && (
                <p className="text-error text-xs mt-1">{errors?.primary_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age *</label>
              <Input
                type="number"
                value={formData?.primaryDevotee?.age}
                onChange={(e) => handlePrimaryDevoteeChange('age', e?.target?.value)}
                placeholder="Enter age"
                min="1"
                max="120"
                className={errors?.primary_age ? 'border-error' : ''}
              />
              {errors?.primary_age && (
                <p className="text-error text-xs mt-1">{errors?.primary_age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData?.primaryDevotee?.phone}
                  onChange={(e) => handlePrimaryDevoteeChange('phone', e?.target?.value)}
                  placeholder="Enter 10-digit phone number"
                  className={`pl-10 ${errors?.primary_phone ? 'border-error' : ''}`}
                  maxLength={10}
                />
              </div>
              {errors?.primary_phone && (
                <p className="text-error text-xs mt-1">{errors?.primary_phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={formData?.primaryDevotee?.email}
                  onChange={(e) => handlePrimaryDevoteeChange('email', e?.target?.value)}
                  placeholder="Enter email address"
                  className={`pl-10 ${errors?.primary_email ? 'border-error' : ''}`}
                />
              </div>
              {errors?.primary_email && (
                <p className="text-error text-xs mt-1">{errors?.primary_email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={formData?.primaryDevotee?.address}
                  onChange={(e) => handlePrimaryDevoteeChange('address', e?.target?.value)}
                  placeholder="Enter complete address (optional)"
                  className="w-full pl-10 pt-3 pb-3 pr-3 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-sw1049-primary/20 focus:border-sw1049-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Devotees */}
        {numberOfTickets > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg sacred-shadow p-6"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <User className="mr-2 h-5 w-5 text-temple-gold" />
              Additional Devotees ({numberOfTickets - 1})
            </h3>

            <div className="space-y-6">
              {formData?.additionalDevotees?.slice(0, numberOfTickets - 1)?.map((devotee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Devotee {index + 2} - Full Name *
                    </label>
                    <Input
                      value={devotee?.name}
                      onChange={(e) => handleAdditionalDevoteeChange(index, 'name', e?.target?.value)}
                      placeholder="Enter full name"
                      className={errors?.[`additional_${index}_name`] ? 'border-error' : ''}
                    />
                    {errors?.[`additional_${index}_name`] && (
                      <p className="text-error text-xs mt-1">{errors?.[`additional_${index}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Age *</label>
                    <Input
                      type="number"
                      value={devotee?.age}
                      onChange={(e) => handleAdditionalDevoteeChange(index, 'age', e?.target?.value)}
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      className={errors?.[`additional_${index}_age`] ? 'border-error' : ''}
                    />
                    {errors?.[`additional_${index}_age`] && (
                      <p className="text-error text-xs mt-1">{errors?.[`additional_${index}_age`]}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-temple-gold/10 border border-temple-gold/30 rounded-lg p-6"
        >
          <h4 className="font-semibold text-temple-gold mb-3">📋 Important Information</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Primary devotee will receive booking confirmation and updates via SMS/Email</li>
            <li>• All devotees must carry valid photo ID during temple visit</li>
            <li>• Names on tickets must match exactly with ID documents</li>
            <li>• Children below 12 years are eligible for discounted rates</li>
            <li>• Mobile number will be used for OTP verification during entry</li>
          </ul>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-6"
        >
          <Button
            type="submit"
            size="lg"
            className="sw1049-gradient text-white px-8 py-3 hover:opacity-90"
          >
            Continue to Payment
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default DevoteeDetailsForm;