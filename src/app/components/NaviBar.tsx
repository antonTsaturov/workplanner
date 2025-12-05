'use client'
import { SetStateAction, useState } from 'react';
import Image from "next/image";
import Link from 'next/link'
import '../globals.css';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { handleFetch} from '../lib/fetch';
import { storage } from '../utils/localStorage';
import { useSession } from './Providers';
import { usePathname } from 'next/navigation'

import Modal  from './Modal';
import { useModal } from '../hooks/useModal';
import UserSettings from './UserSettings';
import {useLangSwitcher} from '../hooks/useLangSwitcher';

const NaviBar = ({ resetSession }: { resetSession: () => void }) => {
  const { session } = useSession();
  const { isModalOpen, open, close} = useModal();
  
  const {switchLanguage} = useLangSwitcher();
  
  const t = useTranslations('naviBar');
  

  const [pathname, setPathname] = useState(usePathname())
  
  const router = useRouter();
    
  const hadleLogout = async () => {
    
    resetSession()
    await handleFetch('logout', 'GET', null);
    router.push('/auth');
    storage.remove('user')
    setPathname('auth');
  }

  const handleClick = (e: SetStateAction<string>) => {
    setPathname(e)
  }
  

  //!pathname.includes('auth') &&
  return  !pathname.includes('auth') && (
    <nav className="navigation">
    
    
      <Modal isOpen={isModalOpen} onClose={close}>
        <UserSettings />
      </Modal>
    
      <div className="nav-container">
        <div className="nav-content">

          {/* Left block */}
          <div className="nav-section">
            <Image
              src="/assets/workplanner_icon.png"
              alt="Workplanner"
              style={{ marginLeft: '1rem'}}
              height={40}
              width={60}
            />

            <div className="nav-links">
              <Link
                href="/pages/calendar"
                className={`nav-link ${pathname?.includes('calendar') ? 'active' : ''}`}
                onClick={()=>handleClick('calendar')}
              >
                {t('calendar')}
              </Link>
              <Link
                href="/pages/staff"
                className={`nav-link ${pathname?.includes('staff') ? 'active' : ''}`}
                onClick={()=>handleClick('staff')}
              >
                {t('staff')}
              </Link>
              <Link
                href="/pages/dashboard"
                className={`nav-link ${pathname?.includes('dashboard') ? 'active' : ''}`}
                onClick={()=>handleClick('dashboard')}
              >
                {t('dashboard')}
              </Link>
            </div>
          </div>

          {/* Right block */}
          <div className="nav-user-section">
              <div className="user-info">
                <div className="user-details">
                  <div className="user-name">{session?.user?.name}</div>
                    <div className="user-dept">{session?.user?.dept}</div>
                </div>

                <div className="dropdown-container">
                  <button className="dropdown-toggle">
                    <span>{t('account')}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  <div className="dropdown-menu">
                  {session ? (
                    <div>
                    
                      <button
                        className="dropdown-item-button"
                        onClick={open}
                      >
                        {t('settings')}
                      </button>
                      
                      {/*<LangSwitcher />*/}
                      <button
                        className="dropdown-item-button"
                        onClick={switchLanguage}
                      >
                        {t('language')}
                      </button>
                      
                      <button
                        onClick={hadleLogout}
                        className="dropdown-item-button logout-button"
                      >
                        {t('logout')}
                      </button>
                      
                    </div>
                    ) : null
                  }
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NaviBar;
