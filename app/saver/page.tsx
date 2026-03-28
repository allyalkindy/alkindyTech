import SaverClient from "../../components/saver/SaverClient"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function Page() {
  return <> <Navigation /> 
            <SaverClient />  
            <Footer />
         </>
}