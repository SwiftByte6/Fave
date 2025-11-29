'use client'

import { useState } from 'react'
import { ExternalLink, Package, Truck, MapPin, CheckCircle2 } from 'lucide-react'

interface OrderTrackingProps {
  order: {
    id: string
    shipping_status: string
    awb_code?: string
    courier_name?: string
    tracking_url?: string
    expected_delivery_date?: string
    actual_delivery_date?: string
  }
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const getStatusSteps = () => {
    const steps = [
      { key: 'processing', label: 'Order Confirmed', icon: Package },
      { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Package },
      { key: 'picked_up', label: 'Picked Up', icon: Truck },
      { key: 'in_transit', label: 'In Transit', icon: Truck },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
    ]

    const currentStatusIndex = steps.findIndex(step => step.key === order.shipping_status)
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      active: index === currentStatusIndex
    }))
  }

  const steps = getStatusSteps()

  return (
    <div className="bg-white rounded-xl p-6 border border-[#F0E7DE] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#6f5a4d]">Shipment Tracking</h3>
        {order.awb_code && (
          <div className="text-sm">
            <span className="text-[#8A6F5C]">AWB: </span>
            <span className="font-mono text-[#6f5a4d]">{order.awb_code}</span>
          </div>
        )}
      </div>

      {/* Progress Tracker */}
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.key} className="flex items-center mb-4 last:mb-0">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-4 top-8 w-0.5 h-8 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Step Circle */}
              <div 
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : step.active
                    ? 'bg-[#F4DCDC] border-[#F4DCDC] text-[#6f5a4d]'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <Icon size={16} />
              </div>
              
              {/* Step Label */}
              <div className="ml-4">
                <p className={`font-medium ${
                  step.completed || step.active ? 'text-[#6f5a4d]' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {step.active && (
                  <p className="text-xs text-[#8A6F5C]">Current Status</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Courier Info & Tracking */}
      {(order.courier_name || order.tracking_url) && (
        <div className="mt-6 pt-6 border-t border-[#F0E7DE]">
          {order.courier_name && (
            <div className="mb-3">
              <span className="text-sm text-[#8A6F5C]">Courier Partner: </span>
              <span className="text-sm font-medium text-[#6f5a4d]">{order.courier_name}</span>
            </div>
          )}
          
          {order.tracking_url && (
            <a
              href={order.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4DCDC] text-[#6f5a4d] rounded-lg hover:bg-[#F0E7DE] transition text-sm font-medium"
            >
              <ExternalLink size={16} />
              Track on Courier Website
            </a>
          )}
        </div>
      )}

      {/* Delivery Date */}
      {order.expected_delivery_date && !order.actual_delivery_date && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Expected Delivery:</strong> {new Date(order.expected_delivery_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {order.actual_delivery_date && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Delivered on:</strong> {new Date(order.actual_delivery_date).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderTracking