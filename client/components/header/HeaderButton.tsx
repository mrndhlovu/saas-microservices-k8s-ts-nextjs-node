const HeaderButton = ({ children, className = "header-button" }) => {
  return (
    <div className={className}>
      <span>{children}</span>
    </div>
  )
}

export default HeaderButton
