import type { ReactNode } from 'react';

/* ============================================= */

export interface NavigationItem {
  id:        string;
  label:     string;
  path?:     string;
  icon?:     ReactNode;
  children?: NavigationItem[];
  roles?:    string[];
  hidden?:   boolean;
}
