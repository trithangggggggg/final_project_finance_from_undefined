import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AddCategoryModal from './components/ui/AddCategoryModal.tsx'
import InfomationUser from './Pages/users/InfomationUser.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <AdminPage></AdminPage> */}
    {/* <AddCategoryModal/> */}
    {/* <InfomationUser></InfomationUser> */}
  </StrictMode>,
)
