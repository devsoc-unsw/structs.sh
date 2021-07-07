File1:
Cats are the evilest creatures

File2:
Doggos are the kindest creatures. Doggos are amazing.

// Relative term frequency:
tf("cats", "File1") = 1 / 5 
                    = 0.2

tf("doggos", "File2") = 2 / 8
                      = 0.25

// Inverted document frequency:
idf("cats", ["File1", "File2"]) = log₁₀(2 / 1) = 0.301

idf("doggos", ["File1", "File2"]) = log₁₀(2 / 1) = 0.301 

idf("the", ["File1", "File2"]) = log₁₀(2 / 2) = 0


// Tf-Idf:
tfidf("cats", "File1") = tf("cats", "File1") * idf("cats", ["File1", "File2"])
                       = 0.2 * 0.301
                       = 0.0602

tfidf("doggos", "File2") = tf("doggos", "File2") * idf("doggos", ["File1", "File2"])
                         = 0.25 * 0.301
                         = 0.0753

