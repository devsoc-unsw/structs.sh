require "tty-prompt"   


prompt = TTY::Prompt.new

begin
    choices = ["linked list", "binary search tree"]
    selectedIndex = prompt.select("Select a data structure", choices)
    puts "You selected %s\n" % [selectedIndex]
    case selectedIndex
    when "linked list"
        system("linked-list/iterative-version/testLinkedList")
    when "binary search tree"
        system("binary-tree/testTree")
        # TODO: Add txt file with all paths
    end
rescue SignalException => e
    nil
end
