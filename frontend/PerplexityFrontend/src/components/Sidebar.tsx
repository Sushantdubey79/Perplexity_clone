import Hamburger from "../icons/hamburger"


export default function Sidebar({
  sideBarStatus,
  sideBarData,
  showIdData,
  onNewConversation,
  activeConversationId,
  isLoading = false,
}: {
  readonly sideBarStatus: () => void;
  readonly sideBarData: any[];
  readonly showIdData: (conversationId: string) => void;
  readonly onNewConversation: () => void;
  readonly activeConversationId: string | null;
  readonly isLoading?: boolean;
}) {



    const sidebarMap = sideBarData.map((element : any , index) => {
        const key = element.id?.toString() ?? index.toString();

        return (
          <button
            key={key}
            type="button"
            title={element.title}
            className={`text-xs overflow-hidden text-ellipsis whitespace-nowrap select-none cursor-pointer text-left w-full rounded px-2 py-1 ${
              activeConversationId === element.id
                ? "bg-indigo-100 text-indigo-800"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              showIdData(element.id);
            }}
          >
            {element.title}
          </button>
        );
    })

    return(

            <div className="h-screen border-r border-gray pt-8 pl-4">

                <div className="w-6">
                    <Hamburger  onClick={() => {
                        sideBarStatus();
                    }} />

                </div>

                <div title="Previous Conversations" className="p-2 mt-4">
                    <button
                      type="button"
                      onClick={onNewConversation}
                      className="mb-4 w-full rounded-lg bg-indigo-600 px-3 py-2 text-left text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      + New Chat
                    </button>
                    <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold select-none">Previous Conversations</h1>
                    
                    <div className="mt-6">
                    {isLoading ? (
                      <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                        Loading...
                      </div>
                    ) : (
                      sidebarMap
                    )}
                    </div>
                </div>

            </div>


    )


}