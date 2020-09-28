require "tty-prompt"   


prompt = TTY::Prompt.new

begin
    choices = ["Linked List", "Binary Search Tree", "AVL Tree", "Splay Tree"]
    selectedIndex = prompt.select("Select a data structure", choices)
    puts "Starting: %s\n" % [selectedIndex]
    case selectedIndex
    when "Linked List"
        system("linked-list/iterative-version/testLinkedList")
    when "Binary Search Tree"
        system("binary-tree/testTree")
    when "AVL Tree"
        system("avl-tree/testTree")
    when "Splay Tree"
        system("splay-tree/testTree")
    end
rescue SignalException => e
    nil
end
