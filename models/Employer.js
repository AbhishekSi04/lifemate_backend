const mongoose = require('mongoose');

/**
 * Employer Schema - Extended user model for employers/hospitals
 * Contains healthcare organization information and hiring preferences
 */
const employerSchema = new mongoose.Schema({
  // Reference to base User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  
  // Organization Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [200, 'Organization name cannot exceed 200 characters'],
  },
  organizationType: {
    type: String,
    required: [true, 'Organization type is required'],
    enum: [
      'Hospital',
      'Clinic',
      'Medical Center',
      'Nursing Home',
      'Diagnostic Center',
      'Pharmacy',
      'Healthcare Startup',
      'Medical Device Company',
      'Pharmaceutical Company',
      'Healthcare IT',
      'Telemedicine',
      'Rehabilitation Center',
      'Mental Health Center',
      'Dental Clinic',
      'Veterinary Clinic',
      'Government Healthcare',
      'NGO',
      'Other'
    ],
  },
  
  // Organization Details
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL'],
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year cannot be before 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
  },
  employeeCount: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'],
  },
  
  // Contact Information
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters'],
    },
    designation: {
      type: String,
      required: [true, 'Contact person designation is required'],
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [50, 'City name cannot exceed 50 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [50, 'State name cannot exceed 50 characters'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [50, 'Country name cannot exceed 50 characters'],
      default: 'India',
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  
  // Healthcare Specializations
  specializations: [{
    type: String,
    trim: true,
    enum: [
      'General Medicine',
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Gynecology',
      'Dermatology',
      'Psychiatry',
      'Radiology',
      'Anesthesiology',
      'Emergency Medicine',
      'Internal Medicine',
      'Surgery',
      'Oncology',
      'Pathology',
      'Ophthalmology',
      'ENT',
      'Urology',
      'Gastroenterology',
      'Pulmonology',
      'Endocrinology',
      'Rheumatology',
      'Nephrology',
      'Hematology',
      'Infectious Disease',
      'Physical Therapy',
      'Occupational Therapy',
      'Speech Therapy',
      'Nursing',
      'Pharmacy',
      'Medical Technology',
      'Other'
    ],
  }],
  
  // Services Offered
  services: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Service description cannot exceed 500 characters'],
    },
  }],
  
  // Accreditation and Certifications
  accreditations: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Accreditation name cannot exceed 100 characters'],
    },
    issuingBody: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Issuing body cannot exceed 100 characters'],
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value >= this.issueDate;
        },
        message: 'Expiry date must be after issue date',
      },
    },
    certificateUrl: {
      type: String,
      trim: true,
    },
  }],
  
  // Organization Images
  logo: {
    url: String,
    filename: String,
    uploadedAt: Date,
  },
  gallery: [{
    url: {
      type: String,
      required: true,
    },
    filename: String,
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Caption cannot exceed 200 characters'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Verification Status
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    documents: [{
      type: {
        type: String,
        enum: ['Business License', 'Registration Certificate', 'Tax Certificate', 'Insurance Certificate', 'Other'],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  
  // Subscription and Billing
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
      default: 'Free',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Cancelled', 'Expired'],
      default: 'Active',
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
    },
    features: {
      maxJobPosts: {
        type: Number,
        default: 1,
      },
      maxApplications: {
        type: Number,
        default: 10,
      },
      advancedSearch: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      customBranding: {
        type: Boolean,
        default: false,
      },
    },
  },
  
  // Hiring Preferences
  hiringPreferences: {
    preferredExperience: {
      min: {
        type: Number,
        min: 0,
        max: 20,
      },
      max: {
        type: Number,
        min: 0,
        max: 50,
      },
    },
    preferredLocations: [{
      city: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'City name cannot exceed 50 characters'],
      },
      state: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'State name cannot exceed 50 characters'],
      },
    }],
    hiringProcess: {
      type: String,
      enum: ['Quick', 'Standard', 'Comprehensive'],
      default: 'Standard',
    },
    responseTime: {
      type: String,
      enum: ['Same day', '1-2 days', '3-5 days', '1 week', 'No preference'],
      default: '3-5 days',
    },
  },
  
  // Statistics
  stats: {
    totalJobPosts: {
      type: Number,
      default: 0,
    },
    activeJobPosts: {
      type: Number,
      default: 0,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    totalHires: {
      type: Number,
      default: 0,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  
  // Settings
  settings: {
    emailNotifications: {
      newApplication: {
        type: Boolean,
        default: true,
      },
      applicationUpdate: {
        type: Boolean,
        default: true,
      },
      jobPostExpiry: {
        type: Boolean,
        default: true,
      },
      subscriptionReminder: {
        type: Boolean,
        default: true,
      },
    },
    privacySettings: {
      showContactInfo: {
        type: Boolean,
        default: true,
      },
      showOrganizationDetails: {
        type: Boolean,
        default: true,
      },
      allowDirectMessages: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full organization name
employerSchema.virtual('fullOrganizationName').get(function() {
  return this.organizationName;
});

// Virtual for full address
employerSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}`;
});

// Index for better query performance
employerSchema.index({ user: 1 });
employerSchema.index({ organizationName: 1 });
employerSchema.index({ organizationType: 1 });
employerSchema.index({ 'address.city': 1 });
employerSchema.index({ 'address.state': 1 });
employerSchema.index({ 'specializations': 1 });
employerSchema.index({ 'verification.isVerified': 1 });
employerSchema.index({ 'subscription.plan': 1 });

/**
 * Check if employer can post more jobs based on subscription
 */
employerSchema.methods.canPostJob = function() {
  return this.stats.activeJobPosts < this.subscription.features.maxJobPosts;
};

/**
 * Check if employer can receive more applications based on subscription
 */
employerSchema.methods.canReceiveApplications = function() {
  return this.stats.totalApplications < this.subscription.features.maxApplications;
};

/**
 * Update job post statistics
 */
employerSchema.methods.updateJobStats = function(increment = 1) {
  this.stats.totalJobPosts += increment;
  this.stats.activeJobPosts += increment;
  return this.save();
};

/**
 * Update application statistics
 */
employerSchema.methods.updateApplicationStats = function(increment = 1) {
  this.stats.totalApplications += increment;
  return this.save();
};

/**
 * Update hire statistics
 */
employerSchema.methods.updateHireStats = function(increment = 1) {
  this.stats.totalHires += increment;
  return this.save();
};

module.exports = mongoose.model('Employer', employerSchema);
