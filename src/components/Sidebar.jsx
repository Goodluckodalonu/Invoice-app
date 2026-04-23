import { useTheme } from '../context/ThemeContext'
import emptyImage from '../assets/avaterMe.png'

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="fixed left-0 top-0 w-full h-[72px] md:h-[80px] lg:h-screen lg:w-[103px] z-50 flex flex-row lg:flex-col lg:rounded-r-[20px] overflow-hidden"
      style={{ backgroundColor: '#1E2139' }}
    >
      {/* Logo */}
      <div className="relative w-[72px] md:w-[80px] lg:w-full h-[72px] md:h-[80px] lg:h-[103px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary rounded-r-[20px] lg:rounded-br-[20px] lg:rounded-tr-none" />
        <div className="absolute bottom-0 lg:bottom-0 left-0 right-0 h-1/2 bg-primary-light rounded-tl-[20px] lg:rounded-tl-[20px] lg:rounded-br-[20px]" />
        <svg className="relative z-10 w-[28px] h-[26px] lg:w-[40px] lg:h-[38px]" viewBox="0 0 40 38">
          <path
            d="M10.69 0L20 18.4L29.31 0C35.67 3.54 40 10.3 40 18C40 29 31.05 38 20 38C8.95 38 0 29 0 18C0 10.3 4.33 3.54 10.69 0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme Toggle */}
      <div className="flex items-center lg:flex-col">
        <button
          onClick={toggleTheme}
          className="px-6 lg:py-6 transition-colors hover:opacity-80 border-r lg:border-r-0 lg:border-b border-[#494E6E] h-full lg:h-auto"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 15a5 5 0 100-10 5 5 0 000 10zM10 0v2M10 18v2M3.515 3.515l1.414 1.414M15.071 15.071l1.414 1.414M0 10h2M18 10h2M3.515 16.485l1.414-1.414M15.071 4.929l1.414-1.414"
                stroke="#858BB2"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M19.502 11.342a.703.703 0 00-.588.128 7.499 7.499 0 01-2.275 1.33 7.523 7.523 0 01-2.581.46A7.516 7.516 0 016.542 5.744a7.505 7.505 0 011.316-2.278.703.703 0 00-.405-1.17A8.752 8.752 0 004.496.961 8.773 8.773 0 00.155 8.508a8.753 8.753 0 0017.377 2.468.703.703 0 00-.03-.634z"
                fill="#858BB2"
              />
            </svg>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center justify-center px-6 lg:py-6">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-transparent">
            <img src={emptyImage} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </aside>
  )
}
