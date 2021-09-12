import Link from "next/link"

interface IProps {
  href: string
  linkText: string
}

const AuthOptionLink = ({ href, linkText }: IProps) => {
  return (
    <div className="auth-form-link-option">
      <ul>
        <li>
          <Link href={`/${href}`}>{linkText}</Link>
        </li>
      </ul>
    </div>
  )
}

export default AuthOptionLink
