import React, { useState } from 'react';

// The only props Debugger.tsx uses: src (the object) and name (null = no label)
interface JsonViewProps {
  src: object;
  name?: string | null;
}

