import React from 'react';
import {
  Archive,
  CheckSquare,
  Crop,
  FileCode,
  FileImage,
  Files,
  FileSignature,
  FileText,
  GitCompare,
  Globe,
  Grid,
  Hash,
  Image,
  Languages,
  Layers,
  Lock,
  Minimize2,
  PenTool,
  Presentation,
  RotateCw,
  ScanText,
  Scissors,
  Sheet,
  ShieldAlert,
  Sparkles,
  Stamp,
  Table,
  Trash2,
  Unlock,
  Wrench,
  File,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<any>> = {
  Archive,
  CheckSquare,
  Crop,
  FileCode,
  FileImage,
  Files,
  FileSignature,
  FileText,
  GitCompare,
  Globe,
  Grid,
  Hash,
  Image,
  Languages,
  Layers,
  Lock,
  Minimize2,
  PenTool,
  Presentation,
  RotateCw,
  ScanText,
  Scissors,
  Sheet,
  ShieldAlert,
  Sparkles,
  Stamp,
  Table,
  Trash2,
  Unlock,
  Wrench,
  File,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size, ...props }) => {
  const IconComponent = ICON_MAP[name] || File;
  return <IconComponent className={className} size={size} {...props} />;
};
