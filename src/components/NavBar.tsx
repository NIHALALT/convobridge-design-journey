import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-40 glass">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-lg hover:opacity-80 transition-opacity" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ConvoBridge
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-foreground">
            Home
          </NavLink>
          <NavLink to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-foreground">
            Pricing
          </NavLink>
          <NavLink to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-foreground">
            About
          </NavLink>
          <NavLink to="/contact-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-foreground">
            Contact
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/login">
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Login</span>
          </NavLink>
          <NavLink to="/dashboard">
            <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg px-5">
              Get Started
            </Button>
          </NavLink>
        </div>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t">
          <div className="px-6 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/pricing', label: 'Pricing' },
              { to: '/about', label: 'About' },
              { to: '/contact-us', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="block text-sm py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-4 mt-2 border-t flex flex-col gap-2">
              <NavLink to="/login" className="w-full" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">Login</Button>
              </NavLink>
              <NavLink to="/dashboard" className="w-full" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">Get Started</Button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}