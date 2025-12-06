import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles, Building2, Wrench, Users, Check, AlertCircle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ChatAssistant = ({ isOpen, onToggle }) => {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your XPERTY assistant. I can help you manage your portfolio.",
      type: 'text'
    },
    {
      role: 'assistant',
      content: "Try asking me to:",
      type: 'suggestions',
      suggestions: [
        { label: 'Add a new property', action: 'add_property_sim' },
        { label: 'Check maintenance', action: 'maintenance_sim' },
        { label: 'Tenant queries', action: 'tenant_sim' }
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text = input) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text, type: 'text' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const response = getAIResponse(text.toLowerCase())

      if (Array.isArray(response)) {
        // Handle multiple messages/steps
        let delay = 0
        response.forEach(msg => {
          setTimeout(() => {
            setMessages(prev => [...prev, msg])
            if (msg === response[response.length - 1]) setIsTyping(false)
          }, delay)
          delay += 800
        })
      } else {
        setMessages(prev => [...prev, response])
        setIsTyping(false)

        if (response.action) {
          setTimeout(() => response.action(), 500)
        }
      }
    }, 1000)
  }

  const getAIResponse = (query) => {
    // --- SIMULATIONS ---

    // 1. Add Property Simulation
    if (query.includes('add property') || query === 'add_property_sim') {
      return [
        {
          role: 'assistant',
          content: "I can help you add a new property. Let's get started!",
          type: 'text'
        },
        {
          role: 'assistant',
          content: "What type of property is it?",
          type: 'options',
          options: [
            { label: 'House', value: 'House' },
            { label: 'Apartment', value: 'Apartment' },
            { label: 'Commercial', value: 'Commercial' }
          ],
          callback: (option) => handleSend(`Selected: ${option.label}`)
        }
      ]
    }

    if (query.includes('selected: house') || query.includes('selected: apartment')) {
      return [
        {
          role: 'assistant',
          content: "Great choice. I've prepared the onboarding wizard for you.",
          type: 'text'
        },
        {
          role: 'assistant',
          content: "Click below to complete the details.",
          type: 'action_card',
          title: 'New Property Draft',
          description: 'Ready to configure',
          icon: Building2,
          actionLabel: 'Open Wizard',
          onAction: () => navigate('/dashboard/properties/new')
        }
      ]
    }

    // 2. Maintenance Approval Simulation
    if (query.includes('maintenance') || query === 'maintenance_sim') {
      return [
        {
          role: 'assistant',
          content: "Checking recent requests...",
          type: 'text'
        },
        {
          role: 'assistant',
          content: "You have a new high-priority request.",
          type: 'approval_card',
          title: 'Leaking Pipe - Unit 4B',
          description: 'Reported by John Doe. Estimated cost: £120',
          status: 'Pending',
          onApprove: () => handleSend('approved_maintenance_123'),
          onReject: () => handleSend('rejected_maintenance_123')
        }
      ]
    }

    if (query === 'approved_maintenance_123') {
      return {
        role: 'assistant',
        content: "✅ Approved! Work order #WO-2024-001 has been created and sent to the contractor.",
        type: 'text'
      }
    }

    if (query === 'rejected_maintenance_123') {
      return {
        role: 'assistant',
        content: "❌ Request rejected. I've notified the tenant to provide more details.",
        type: 'text'
      }
    }

    // 3. Tenant Query Simulation
    if (query.includes('tenant') || query === 'tenant_sim') {
      return [
        {
          role: 'assistant',
          content: "You have an unread message from Sarah (12 High St).",
          type: 'text'
        },
        {
          role: 'assistant',
          content: "\"Hi, is it okay if I paint the living room wall blue?\"",
          type: 'message_card',
          sender: 'Sarah Jenkins',
          time: '10:30 AM',
          avatar: 'S'
        },
        {
          role: 'assistant',
          content: "How would you like to reply?",
          type: 'options',
          options: [
            { label: 'Approve', value: 'Yes, as long as you repaint it back when moving out.' },
            { label: 'Reject', value: 'Sorry, painting is not allowed per the lease.' },
            { label: 'Ask for details', value: 'Please send me the color code first.' }
          ],
          callback: (option) => handleSend(`Reply: ${option.value}`)
        }
      ]
    }

    if (query.startsWith('reply:')) {
      const replyText = query.replace('reply: ', '')
      return {
        role: 'assistant',
        content: `Sent: "${replyText}"`,
        type: 'text'
      }
    }

    // Standard Navigation & Help
    if (query.includes('help')) {
      return {
        role: 'assistant',
        content: "I can help with properties, maintenance, and tenants. Try the suggestions below:",
        type: 'suggestions',
        suggestions: [
          { label: 'Add Property', action: 'add_property_sim' },
          { label: 'Maintenance', action: 'maintenance_sim' },
          { label: 'Tenant Queries', action: 'tenant_sim' }
        ]
      }
    }

    // Default Fallback
    return {
      role: 'assistant',
      content: "I'm not sure about that yet. Try asking 'help' to see what I can do!",
      type: 'text'
    }
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 sm:bottom-24 sm:right-4 md:right-6 w-full max-w-[clamp(280px,90vw,420px)] sm:max-w-[clamp(320px,85vw,480px)] z-50 animate-slide-in-right">
          <div className="bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl flex flex-col h-[clamp(400px,70vh,600px)] overflow-hidden ring-1 ring-black/5">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-900 to-brand-800 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary-light" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">XPERTY AI</h3>
                  <p className="text-[10px] text-brand-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => onToggle(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  {/* Text Bubbles */}
                  {msg.type === 'text' && (
                    <div
                      className={`max-w-[85%] p-3.5 text-sm rounded-2xl shadow-sm ${msg.role === 'user'
                          ? 'bg-brand-900 text-white rounded-tr-none'
                          : 'bg-white text-brand-800 border border-brand-100 rounded-tl-none'
                        }`}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Suggestions Chips */}
                  {msg.type === 'suggestions' && (
                    <div className="space-y-2 w-full">
                      <p className="text-xs text-brand-500 ml-1">{msg.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(s.action)}
                            className="text-xs bg-white border border-brand-200 text-brand-700 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options Selection */}
                  {msg.type === 'options' && (
                    <div className="space-y-2 max-w-[85%]">
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-brand-100 shadow-sm text-sm text-brand-800">
                        {msg.content}
                      </div>
                      <div className="flex flex-col gap-2">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => msg.callback(opt)}
                            className="text-left text-sm bg-white border border-brand-200 p-2.5 rounded-xl hover:border-primary hover:shadow-md transition-all flex items-center justify-between group"
                          >
                            <span className="text-brand-700 group-hover:text-brand-900">{opt.label}</span>
                            <ChevronRight className="w-4 h-4 text-brand-300 group-hover:text-primary" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Card */}
                  {msg.type === 'action_card' && (
                    <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm max-w-[85%] hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-light text-primary rounded-lg flex items-center justify-center">
                          <msg.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-brand-900 text-sm">{msg.title}</h4>
                          <p className="text-xs text-brand-500">{msg.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={msg.onAction}
                        className="w-full py-2 bg-brand-900 text-white text-xs font-medium rounded-lg hover:bg-brand-800 transition-colors"
                      >
                        {msg.actionLabel}
                      </button>
                    </div>
                  )}

                  {/* Approval Card */}
                  {msg.type === 'approval_card' && (
                    <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm max-w-[90%]">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-brand-900 text-sm">{msg.title}</h4>
                        <span className="px-2 py-0.5 bg-warning-light text-warning text-[10px] font-bold rounded-full uppercase tracking-wide">
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-xs text-brand-600 mb-4">{msg.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={msg.onReject}
                          className="flex-1 py-1.5 border border-error text-error text-xs font-medium rounded-lg hover:bg-error-light transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={msg.onApprove}
                          className="flex-1 py-1.5 bg-brand-900 text-white text-xs font-medium rounded-lg hover:bg-brand-800 transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Card (Tenant Query) */}
                  {msg.type === 'message_card' && (
                    <div className="bg-white p-3 rounded-xl border border-brand-200 shadow-sm max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {msg.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-brand-900">{msg.sender}</p>
                          <p className="text-[10px] text-brand-400">{msg.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-brand-700 italic border-l-2 border-brand-200 pl-2">
                        "{msg.content}"
                      </p>
                    </div>
                  )}

                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-brand-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-brand-100">
              <div className="flex items-center gap-2 bg-brand-50 p-1.5 rounded-full border border-brand-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 text-sm bg-transparent border-none outline-none text-brand-900 placeholder-brand-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-brand-900 text-white rounded-full hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button - Hidden on Mobile */}
      <button
        onClick={() => onToggle(!isOpen)}
        className="hidden sm:flex fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-brand-900 text-white shadow-2xl hover:bg-brand-800 transition-all hover:scale-110 items-center justify-center rounded-full z-40 border-2 border-white/20"
        title="Open XPERTY Assistant"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>
    </>
  )
}

export default ChatAssistant
