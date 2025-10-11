'use client'

import React from 'react'

interface PaymentStatusProps {
  status: string
  paymentId?: string
  paymentMethod?: string
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  paymentId, 
  paymentMethod 
}) => {
  const getPaymentStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          text: 'Payment Pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          description: 'Your payment is being processed'
        }
      case 'processing':
        return {
          icon: '🔄',
          text: 'Payment Processing',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          description: 'Your payment is being verified'
        }
      case 'shipped':
      case 'delivered':
      case 'success':
        return {
          icon: '✅',
          text: 'Payment Successful',
          color: 'bg-green-100 text-green-800 border-green-200',
          description: 'Payment completed successfully'
        }
      case 'cancelled':
        return {
          icon: '❌',
          text: 'Payment Failed',
          color: 'bg-red-100 text-red-800 border-red-200',
          description: 'Payment was not completed'
        }
      default:
        return {
          icon: '❓',
          text: 'Payment Status Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          description: 'Payment status is unclear'
        }
    }
  }

  const paymentInfo = getPaymentStatusInfo()

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{paymentInfo.icon}</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${paymentInfo.color}`}>
            {paymentInfo.text}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{paymentInfo.description}</p>
      
      {(paymentId || paymentMethod) && (
        <div className="text-xs text-gray-500 space-y-1">
          {paymentId && (
            <div>
              <span className="font-medium">Payment ID:</span> {paymentId}
            </div>
          )}
          {paymentMethod && (
            <div>
              <span className="font-medium">Method:</span> {paymentMethod}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PaymentStatus
