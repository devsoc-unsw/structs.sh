# Startup: gotty -w --title-format "Data Structures & Algorithms" ruby terminal 
require "tty-prompt"   
require "colorize"

prompt = TTY::Prompt.new

begin
    choices = ["Linked List", "Binary Search Tree", "AVL Tree", "Splay Tree", "Get me out of here"]
    selectedIndex = prompt.select("Select a data structure".yellow, choices)
    puts "Starting: %s\n".blue % [selectedIndex]
    case selectedIndex
    when "Linked List"
        system("linked-list/iterative-version/testLinkedList")
    when "Binary Search Tree"
        system("binary-tree/testTree")
    when "AVL Tree"
        system("avl-tree/testTree")
    when "Splay Tree"
        system("splay-tree/testTree")
    when "Get me out of here"
        puts "Bye ;("
    end
rescue SignalException => e
    nil
end
