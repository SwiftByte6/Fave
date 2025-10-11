'use client'

interface PaymentStatusProps {
  status: string
  paymentId?: string
  paymentMethod?: string
}

const PaymentStatus = ({ status, paymentId, paymentMethod }: PaymentStatusProps) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'pending':
        return '⏳'
      case 'cancelled':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(status)}`}>
        <span className="mr-1">{getPaymentStatusIcon(status)}</span>
        Payment {status}
      </span>
      {paymentId && (
        <span className="text-xs text-gray-500">
          ID: {paymentId.slice(-8)}
        </span>
      )}
      {paymentMethod && (
        <span className="text-xs text-gray-500 capitalize">
          via {paymentMethod}
        </span>
      )}
    </div>
  )
}

export default PaymentStatus

