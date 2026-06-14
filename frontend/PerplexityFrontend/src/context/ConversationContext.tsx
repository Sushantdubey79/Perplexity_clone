import { createContext , useState  , type ReactNode , type Dispatch , type SetStateAction} from "react"

export const ConversationContext = createContext<{
    conversationId: string | null;
    setConversationId: Dispatch<SetStateAction<string>> ;
} | undefined>(undefined);


export function ConversationContextProvider({children} : {children : ReactNode}){

    const [conversationId , setConversationId] = useState<string>("")

    return(

        <ConversationContext.Provider value={{conversationId , setConversationId}}>
            {children}
        </ConversationContext.Provider>

    )

}