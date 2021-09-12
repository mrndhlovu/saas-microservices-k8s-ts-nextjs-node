import { ReactNode } from "react"

interface IProps {
  option?: ReactNode
  icon?: ReactNode
  title?: string
  className: string
}

const CardModule = ({ icon, title, className, option }: IProps) => {
  return (
    <div className="card-module">
      <div className={`module-header ${className || ""}`}>
        <span className="module-icon">{icon}</span>
        <h3>{title}</h3>
        {option && <div className="module-option">{option}</div>}
      </div>
    </div>
  )
}

export default CardModule
