import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader, Database, Globe } from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase';

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'demo'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    
    if (!isSupabaseConfigured()) {
      setStatus('demo');
      setDetails('Supabase environment variables not configured. Using demo mode.');
      return;
    }

    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setStatus('connected');
        setDetails('Successfully connected to Supabase database.');
      } else {
        setStatus('disconnected');
        setDetails(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('disconnected');
      setDetails('Failed to test connection.');
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Connected to Supabase',
          description: 'Your admin panel is connected to the live database.'
        };
      case 'disconnected':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Connection Failed',
          description: 'Unable to connect to Supabase database.'
        };
      case 'demo':
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Demo Mode Active',
          description: 'Supabase not configured. Changes will not persist.'
        };
      default:
        return {
          icon: Loader,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Checking Connection',
          description: 'Testing Supabase connection...'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 mb-6`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`h-5 w-5 ${config.color} ${status === 'checking' ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{config.description}</p>
          {details && (
            <p className="text-xs text-gray-500 mt-2">{details}</p>
          )}
          {status === 'demo' && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 text-sm mb-2">To connect to Supabase:</h4>
              <ol className="text-xs text-orange-700 space-y-1">
                <li>1. Get your Supabase URL and Anon Key from your project settings</li>
                <li>2. Add them as environment variables in Netlify</li>
                <li>3. Redeploy your site</li>
              </ol>
            </div>
          )}
          <button
            onClick={checkConnection}
            className={`mt-3 text-xs ${config.color} hover:underline`}
          >
            Test Connection Again
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectionStatus;