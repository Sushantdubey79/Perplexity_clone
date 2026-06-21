import Topbar from "../components/Topbar";
import Loading from "../components/Loading";
import { useState, useEffect, useContext } from "react";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router";
import useSupabaseClient from "../hooks/useSupabaseClient";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { config } from "../configuration/config";
import Main from "../components/Main";
import { ConversationContext } from "../context/ConversationContext";

interface ConversationMessage {
  id: number;
  content: string;
  role: string;
  created: string;
}

export default function Home() {
  const [userName, setUserName] = useState<string>();
  const { userData, loading } = useUserData();
  const [isAuth, setIsAuth] = useState(false);
  const router = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [conversationalData, setConversationalData] = useState<any[]>([]);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [sidebarRefreshing, setSidebarRefreshing] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<
    ConversationMessage[]
  >([]);

  const { conversationId, setConversationId } =
    useContext(ConversationContext)!;

  const getUserConversationalData = async (options?: { silent?: boolean }) => {
    try {
      if (options?.silent) {
        setSidebarRefreshing(true);
      } else {
        setConversationLoading(true);
      }

      const Auth = JSON.parse(localStorage.getItem("userData") || "{}");
      const access_token = Auth?.access_token;

      const data = await axios.get(
        config.BACKEND_URL +
          "/user/getConversationalData/" +
          userData?.supaBaseId,
        {
          headers: {
            Authorization: `${access_token}`,
          },
        }
      );

      setConversationalData(data.data.conversation || []);
    } catch (e) {
      console.log("error ", e);
    } finally {
      if (options?.silent) {
        setSidebarRefreshing(false);
      } else {
        setConversationLoading(false);
      }
    }
  };

  const refreshConversations = () => getUserConversationalData({ silent: true });

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      setConversationId(conversationId);

      const Auth = JSON.parse(localStorage.getItem("userData") || "{}");
      const access_token = Auth?.access_token;

      const response = await axios.get(
        `${config.BACKEND_URL}/user/getMessages/${conversationId}`,
        {
          headers: {
            Authorization: `${access_token}`,
          },
        }
      );

      setConversationMessages(response.data.messages || []);
    } catch (e) {
      console.log("Error fetching conversation messages", e);
      setConversationMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleNewConversation = () => {
    setConversationId("");
    setConversationMessages([]);
  };

  const handleConversationClick = (conversationId: string) => {
    fetchConversationMessages(conversationId);
  };

  function setOpenStatus() {
    setIsOpen(!isOpen);
  }

  const supabase = useSupabaseClient();

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.supabase.auth.signOut();
      localStorage.removeItem("userData");
      setLogoutLoading(false);
      router("/");
    } catch (e) {
      alert("Unable to logout the user");
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      const Auth = JSON.parse(localStorage.getItem("userData")!);
      if (
        Object.keys(userData!).length > 0 &&
        userData.supaBaseId === Auth?.supaBaseId
      ) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.username) {
      setUserName(userData.username);
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.username) {
      getUserConversationalData();
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && !isAuth) {
      router("/");
    }
  }, [loading, isAuth, router]);

  if (loading || logoutLoading) return <Loading />;

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        <Sidebar
          isSideBarOpen={isOpen}
          showIdData={handleConversationClick}
          sideBarStatus={setOpenStatus}
          sideBarData={conversationalData}
          onNewConversation={handleNewConversation}
          activeConversationId={conversationId}
          isLoading={conversationLoading || sidebarRefreshing}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-10 flex w-full">
          <div className="flex-1">
            <Topbar username={userName!} logout={logout} />
          </div>
        </header>

        <main className="flex-1 min-h-0 min-w-0 overflow-hidden break-words">
          <Main
            messages={conversationMessages}
            setMessages={setConversationMessages}
            loading={messagesLoading}
            onConversationCreated={refreshConversations}
          />
        </main>
      </div>
    </div>
  );
}
