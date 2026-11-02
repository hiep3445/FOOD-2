import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Bot, MessageCircle, Send, X } from 'lucide-react'

type ChatProduct = { name: string; description: string; price: number; isAvailable: number }
type ChatMessage = { id: number; text: string; sender: 'bot' | 'customer'; action?: { label: string; to: string } }

const suggestions = ['Phí giao hàng bao nhiêu?', 'Quán có món gì?', 'Theo dõi đơn hàng']
const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

function normalize(value: string) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
}

function getReply(message: string, products: ChatProduct[], deliveryFee: number): Omit<ChatMessage, 'id' | 'sender'> {
  const question = normalize(message)
  const product = [...products].sort((a, b) => b.name.length - a.name.length).find((item) => question.includes(normalize(item.name)))

  if (product) {
    return {
      text: `${product.name} hiện ${product.isAvailable ? 'đang có món' : 'tạm hết'}, giá ${money(product.price)}.${product.description ? ` ${product.description}` : ''}`,
      action: product.isAvailable ? { label: 'Xem thực đơn', to: '/#thuc-don' } : undefined,
    }
  }
  if (/^(xin chao|chao|hello|hi|hey)\b/.test(question)) {
    return { text: 'Xin chào! Mình có thể giúp bạn xem món, hỏi phí giao hàng, cách đặt món hoặc theo dõi đơn nhé.' }
  }
  if (/(phi giao|phi ship|ship bao nhieu|giao hang|van chuyen)/.test(question)) {
    return { text: `Phí giao hàng hiện tại là ${money(deliveryFee)}. Quán giao tận nhà và thanh toán khi nhận món (COD).` }
  }
  if (/(bao lau|mat bao lau|thoi gian|khi nao toi|giao trong)/.test(question)) {
    return { text: 'Thời gian giao dự kiến khoảng 30–45 phút, tùy khu vực và tình hình giao thông.' }
  }
  if (/(thanh toan|cod|tien mat|chuyen khoan|the ngan hang)/.test(question)) {
    return { text: 'Hiện quán hỗ trợ thanh toán tiền mặt khi nhận món (COD). Bạn thanh toán trực tiếp cho người giao hàng nhé.' }
  }
  if (/(theo doi|trang thai|kiem tra don|ma don|don hang cua toi)/.test(question)) {
    return { text: 'Bạn có thể xem trạng thái đơn hàng tại trang theo dõi. Mã theo dõi được lưu trên thiết bị đã đặt món.', action: { label: 'Theo dõi đơn hàng', to: '/track' } }
  }
  if (/(dat mon|dat hang|mua hang|gio hang|cach dat)/.test(question)) {
    return { text: 'Bạn chọn món trong thực đơn, thêm vào giỏ hàng rồi chọn “Tiến hành đặt món”. Điền thông tin nhận hàng và xác nhận đơn để quán bắt đầu chuẩn bị nhé.', action: { label: 'Mở thực đơn', to: '/#thuc-don' } }
  }
  if (/(thuc don|co mon gi|mon nao|xem mon|danh sach mon)/.test(question)) {
    const available = products.filter((item) => item.isAvailable)
    if (!available.length) return { text: 'Bếp đang cập nhật thực đơn. Bạn vui lòng quay lại xem sau nhé.' }
    const menu = available.slice(0, 5).map((item) => `${item.name} (${money(item.price)})`).join(', ')
    const more = available.length > 5 ? ` và ${available.length - 5} món khác` : ''
    return { text: `Các món đang phục vụ: ${menu}${more}. Nhắn tên món nếu bạn muốn hỏi thêm nhé.`, action: { label: 'Xem toàn bộ thực đơn', to: '/#thuc-don' } }
  }
  return { text: 'Mình chưa hiểu rõ câu hỏi. Bạn có thể hỏi về thực đơn, giá món, phí giao hàng, thanh toán COD hoặc theo dõi đơn nhé.' }
}

export default function CustomerChat({ products, deliveryFee }: { products: ChatProduct[]; deliveryFee: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, sender: 'bot', text: 'Chào bạn! Mình là trợ lý của Bếp Nhà Mình. Bạn cần mình hỗ trợ gì ạ?' },
  ])
  const nextId = useRef(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [isOpen, messages])

  const sendMessage = (value: string) => {
    const text = value.trim().slice(0, 500)
    if (!text) return
    const customerMessage: ChatMessage = { id: nextId.current++, sender: 'customer', text }
    const reply = getReply(text, products, deliveryFee)
    const botMessage: ChatMessage = { id: nextId.current++, sender: 'bot', ...reply }
    setMessages((current) => [...current, customerMessage, botMessage].slice(-50))
    setDraft('')
  }

  return <div className="customer-chat">
    {isOpen && <section className="chat-panel" aria-label="Trò chuyện với Bếp Nhà Mình">
      <header className="chat-header">
        <span className="chat-avatar"><Bot size={20} /></span>
        <div><strong>Trợ lý Bếp Nhà Mình</strong><small>Luôn sẵn sàng hỗ trợ bạn</small></div>
        <button className="chat-close" type="button" aria-label="Đóng trò chuyện" onClick={() => setIsOpen(false)}><X size={19} /></button>
      </header>
      <div className="chat-messages" aria-live="polite">
        {messages.map((message) => <div className={`chat-message ${message.sender}`} key={message.id}>
          <p>{message.text}</p>
          {message.action && <Link className="chat-action" to={message.action.to} onClick={() => setIsOpen(false)}>{message.action.label}</Link>}
        </div>)}
        {messages.length === 1 && <div className="chat-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}</div>}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); sendMessage(draft) }}>
        <input aria-label="Nhập câu hỏi" maxLength={500} placeholder="Nhập câu hỏi của bạn..." value={draft} onChange={(event) => setDraft(event.target.value)} />
        <button type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Send size={17} /></button>
      </form>
    </section>}
    <button className={`chat-toggle${isOpen ? ' open' : ''}`} type="button" aria-label={isOpen ? 'Đóng trò chuyện' : 'Mở trò chuyện hỗ trợ'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
      {isOpen ? <X size={23} /> : <><MessageCircle size={22} /><span>Chat hỗ trợ</span></>}
    </button>
  </div>
}
