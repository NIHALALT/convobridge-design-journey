import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full glass z-40 border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-bold text-xl hover:text-primary transition-colors">
          ConvoBridge
        </NavLink>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="text-caption text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-primary">
            Home
          </NavLink>
          <NavLink to="/pricing" className="text-caption text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-primary">
            Pricing
          </NavLink>
          <NavLink to="/about" className="text-caption text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-primary">
            About
          </NavLink>
          <NavLink to="/contact-us" className="text-caption text-muted-foreground hover:text-foreground transition-colors" activeClassName="text-primary">
            Contact
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </NavLink>
          <NavLink to="/dashboard">
            <Button size="sm">Get Started</Button>
          </NavLink>
        </div>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t">
          <div className="px-4 py-3 space-y-2">
            <NavLink 
              to="/" 
              className="block text-sm font-medium py-2 px-2 rounded hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/pricing" 
              className="block text-sm font-medium py-2 px-2 rounded hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className="block text-sm font-medium py-2 px-2 rounded hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact-us" 
              className="block text-sm font-medium py-2 px-2 rounded hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact
            </NavLink>
            <div className="pt-4 border-t flex flex-col gap-2">
              <NavLink to="/login" className="w-full">
                <Button variant="ghost" size="sm" className="w-full">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/dashboard" className="w-full">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
