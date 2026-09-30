export interface SeedContent {
  id: string;
  title: string;
  category: string;
  topic: string;
  subtopic?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes: number;
  prerequisites?: string[];
  skills?: string[];
  leetcodeUrl?: string | null;
  gfgUrl?: string | null;
  solutionUrl?: string | null;
  tags?: string[];
  isRevision?: boolean;
  problemStatement?: string;
  expectedConcepts?: string[];
  description?: string;
}

export const dsaContent: SeedContent[] = [
  // Arrays
  { id: "dsa-001", title: "Two Sum", category: "DSA", topic: "Arrays", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/two-sum/", gfgUrl: "https://www.geeksforgeeks.org/problems/key-pair5616/1", tags: ["arrays", "hashing"], skills: ["hash-map"] },
  { id: "dsa-002", title: "Best Time to Buy and Sell Stock", category: "DSA", topic: "Arrays", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", tags: ["arrays", "greedy"], skills: ["kadane-variant"] },
  { id: "dsa-003", title: "Contains Duplicate", category: "DSA", topic: "Arrays", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", tags: ["arrays", "hashing"] },
  { id: "dsa-004", title: "Product of Array Except Self", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", tags: ["arrays", "prefix"] },
  { id: "dsa-005", title: "Maximum Subarray", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", gfgUrl: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1", tags: ["arrays", "kadane"] },
  { id: "dsa-006", title: "Maximum Product Subarray", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/", tags: ["arrays", "dp"] },
  { id: "dsa-007", title: "Find Minimum in Rotated Sorted Array", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", tags: ["arrays", "binary-search"] },
  { id: "dsa-008", title: "3Sum", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/3sum/", tags: ["arrays", "two-pointers"] },
  { id: "dsa-009", title: "Container With Most Water", category: "DSA", topic: "Arrays", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", tags: ["arrays", "two-pointers"] },
  { id: "dsa-010", title: "Merge Sorted Array", category: "DSA", topic: "Arrays", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/merge-sorted-array/", tags: ["arrays"] },

  // Strings
  { id: "dsa-011", title: "Valid Anagram", category: "DSA", topic: "Strings", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", tags: ["strings", "hashing"] },
  { id: "dsa-012", title: "Valid Palindrome", category: "DSA", topic: "Strings", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", tags: ["strings", "two-pointers"] },
  { id: "dsa-013", title: "Longest Common Prefix", category: "DSA", topic: "Strings", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/longest-common-prefix/", tags: ["strings"] },
  { id: "dsa-014", title: "Group Anagrams", category: "DSA", topic: "Strings", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", tags: ["strings", "hashing"] },
  { id: "dsa-015", title: "Longest Palindromic Substring", category: "DSA", topic: "Strings", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", tags: ["strings"] },
  { id: "dsa-016", title: "Encode and Decode Strings", category: "DSA", topic: "Strings", difficulty: "MEDIUM", estimatedMinutes: 40, gfgUrl: "https://www.geeksforgeeks.org/problems/encode-and-decode-strings/1", tags: ["strings"] },

  // Hashing
  { id: "dsa-017", title: "Ransom Note", category: "DSA", topic: "Hashing", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/ransom-note/", tags: ["hashing"] },
  { id: "dsa-018", title: "Intersection of Two Arrays II", category: "DSA", topic: "Hashing", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/intersection-of-two-arrays-ii/", tags: ["hashing"] },
  { id: "dsa-019", title: "Top K Frequent Elements", category: "DSA", topic: "Hashing", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", tags: ["hashing", "heap"] },
  { id: "dsa-020", title: "Longest Consecutive Sequence", category: "DSA", topic: "Hashing", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/", tags: ["hashing"] },

  // Two Pointers
  { id: "dsa-021", title: "Move Zeroes", category: "DSA", topic: "Two Pointers", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/move-zeroes/", tags: ["two-pointers"] },
  { id: "dsa-022", title: "Two Sum II - Input Array Is Sorted", category: "DSA", topic: "Two Pointers", difficulty: "MEDIUM", estimatedMinutes: 30, leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", tags: ["two-pointers"] },
  { id: "dsa-023", title: "Trapping Rain Water", category: "DSA", topic: "Two Pointers", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", tags: ["two-pointers"] },
  { id: "dsa-024", title: "Remove Duplicates from Sorted Array", category: "DSA", topic: "Two Pointers", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", tags: ["two-pointers"] },

  // Sliding Window
  { id: "dsa-025", title: "Longest Substring Without Repeating Characters", category: "DSA", topic: "Sliding Window", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", tags: ["sliding-window"] },
  { id: "dsa-026", title: "Minimum Window Substring", category: "DSA", topic: "Sliding Window", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", tags: ["sliding-window"] },
  { id: "dsa-027", title: "Find All Anagrams in a String", category: "DSA", topic: "Sliding Window", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", tags: ["sliding-window"] },
  { id: "dsa-028", title: "Max Consecutive Ones III", category: "DSA", topic: "Sliding Window", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/", tags: ["sliding-window"] },
  { id: "dsa-029", title: "Permutation in String", category: "DSA", topic: "Sliding Window", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/", tags: ["sliding-window"] },

  // Stack
  { id: "dsa-030", title: "Valid Parentheses", category: "DSA", topic: "Stack", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", tags: ["stack"] },
  { id: "dsa-031", title: "Min Stack", category: "DSA", topic: "Stack", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/min-stack/", tags: ["stack"] },
  { id: "dsa-032", title: "Evaluate Reverse Polish Notation", category: "DSA", topic: "Stack", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", tags: ["stack"] },
  { id: "dsa-033", title: "Daily Temperatures", category: "DSA", topic: "Stack", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", tags: ["stack", "monotonic"] },
  { id: "dsa-034", title: "Largest Rectangle in Histogram", category: "DSA", topic: "Stack", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/", tags: ["stack"] },

  // Queue
  { id: "dsa-035", title: "Implement Queue using Stacks", category: "DSA", topic: "Queue", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/", tags: ["queue", "stack"] },
  { id: "dsa-036", title: "Number of Recent Calls", category: "DSA", topic: "Queue", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/number-of-recent-calls/", tags: ["queue"] },
  { id: "dsa-037", title: "Design Circular Queue", category: "DSA", topic: "Queue", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/design-circular-queue/", tags: ["queue"] },

  // Linked List
  { id: "dsa-038", title: "Reverse Linked List", category: "DSA", topic: "Linked List", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", tags: ["linked-list"] },
  { id: "dsa-039", title: "Linked List Cycle", category: "DSA", topic: "Linked List", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", tags: ["linked-list"] },
  { id: "dsa-040", title: "Merge Two Sorted Lists", category: "DSA", topic: "Linked List", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", tags: ["linked-list"] },
  { id: "dsa-041", title: "Remove Nth Node From End of List", category: "DSA", topic: "Linked List", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", tags: ["linked-list"] },
  { id: "dsa-042", title: "Reorder List", category: "DSA", topic: "Linked List", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/reorder-list/", tags: ["linked-list"] },
  { id: "dsa-043", title: "LRU Cache", category: "DSA", topic: "Linked List", difficulty: "MEDIUM", estimatedMinutes: 50, leetcodeUrl: "https://leetcode.com/problems/lru-cache/", tags: ["linked-list", "hashing", "design"] },
  { id: "dsa-044", title: "Copy List with Random Pointer", category: "DSA", topic: "Linked List", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/", tags: ["linked-list"] },

  // Binary Search
  { id: "dsa-045", title: "Binary Search", category: "DSA", topic: "Binary Search", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/binary-search/", tags: ["binary-search"] },
  { id: "dsa-046", title: "Search Insert Position", category: "DSA", topic: "Binary Search", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/search-insert-position/", tags: ["binary-search"] },
  { id: "dsa-047", title: "First Bad Version", category: "DSA", topic: "Binary Search", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/first-bad-version/", tags: ["binary-search"] },
  { id: "dsa-048", title: "Search in Rotated Sorted Array", category: "DSA", topic: "Binary Search", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/", tags: ["binary-search"] },
  { id: "dsa-049", title: "Find Peak Element", category: "DSA", topic: "Binary Search", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/find-peak-element/", tags: ["binary-search"] },
  { id: "dsa-050", title: "Time Based Key-Value Store", category: "DSA", topic: "Binary Search", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/", tags: ["binary-search", "design"] },
  { id: "dsa-051", title: "Median of Two Sorted Arrays", category: "DSA", topic: "Binary Search", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", tags: ["binary-search"] },

  // Trees
  { id: "dsa-052", title: "Maximum Depth of Binary Tree", category: "DSA", topic: "Trees", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", tags: ["trees"] },
  { id: "dsa-053", title: "Invert Binary Tree", category: "DSA", topic: "Trees", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/", tags: ["trees"] },
  { id: "dsa-054", title: "Same Tree", category: "DSA", topic: "Trees", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/same-tree/", tags: ["trees"] },
  { id: "dsa-055", title: "Binary Tree Level Order Traversal", category: "DSA", topic: "Trees", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", tags: ["trees", "bfs"] },
  { id: "dsa-056", title: "Binary Tree Right Side View", category: "DSA", topic: "Trees", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/", tags: ["trees"] },
  { id: "dsa-057", title: "Lowest Common Ancestor of a Binary Tree", category: "DSA", topic: "Trees", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", tags: ["trees"] },
  { id: "dsa-058", title: "Serialize and Deserialize Binary Tree", category: "DSA", topic: "Trees", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", tags: ["trees"] },
  { id: "dsa-059", title: "Construct Binary Tree from Preorder and Inorder Traversal", category: "DSA", topic: "Trees", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", tags: ["trees"] },

  // BST
  { id: "dsa-060", title: "Validate Binary Search Tree", category: "DSA", topic: "BST", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", tags: ["bst"] },
  { id: "dsa-061", title: "Kth Smallest Element in a BST", category: "DSA", topic: "BST", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", tags: ["bst"] },
  { id: "dsa-062", title: "Lowest Common Ancestor of a BST", category: "DSA", topic: "BST", difficulty: "MEDIUM", estimatedMinutes: 30, leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", tags: ["bst"] },
  { id: "dsa-063", title: "Convert Sorted Array to Binary Search Tree", category: "DSA", topic: "BST", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/", tags: ["bst"] },

  // Heap / Priority Queue
  { id: "dsa-064", title: "Kth Largest Element in an Array", category: "DSA", topic: "Heap", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", tags: ["heap"] },
  { id: "dsa-065", title: "Last Stone Weight", category: "DSA", topic: "Heap", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/", tags: ["heap"] },
  { id: "dsa-066", title: "Find Median from Data Stream", category: "DSA", topic: "Priority Queue", difficulty: "HARD", estimatedMinutes: 55, leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/", tags: ["heap", "design"] },
  { id: "dsa-067", title: "Task Scheduler", category: "DSA", topic: "Priority Queue", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/task-scheduler/", tags: ["heap", "greedy"] },
  { id: "dsa-068", title: "Merge k Sorted Lists", category: "DSA", topic: "Heap", difficulty: "HARD", estimatedMinutes: 55, leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", tags: ["heap", "linked-list"] },

  // Greedy
  { id: "dsa-069", title: "Jump Game", category: "DSA", topic: "Greedy", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/jump-game/", tags: ["greedy"] },
  { id: "dsa-070", title: "Jump Game II", category: "DSA", topic: "Greedy", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/", tags: ["greedy"] },
  { id: "dsa-071", title: "Gas Station", category: "DSA", topic: "Greedy", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/gas-station/", tags: ["greedy"] },
  { id: "dsa-072", title: "Partition Labels", category: "DSA", topic: "Greedy", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/partition-labels/", tags: ["greedy"] },

  // Backtracking
  { id: "dsa-073", title: "Subsets", category: "DSA", topic: "Backtracking", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/subsets/", tags: ["backtracking"] },
  { id: "dsa-074", title: "Combination Sum", category: "DSA", topic: "Backtracking", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/combination-sum/", tags: ["backtracking"] },
  { id: "dsa-075", title: "Permutations", category: "DSA", topic: "Backtracking", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/permutations/", tags: ["backtracking"] },
  { id: "dsa-076", title: "Word Search", category: "DSA", topic: "Backtracking", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/word-search/", tags: ["backtracking"] },
  { id: "dsa-077", title: "N-Queens", category: "DSA", topic: "Backtracking", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/n-queens/", tags: ["backtracking"] },

  // Graphs
  { id: "dsa-078", title: "Number of Islands", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", tags: ["graphs", "dfs", "bfs"] },
  { id: "dsa-079", title: "Clone Graph", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/clone-graph/", tags: ["graphs"] },
  { id: "dsa-080", title: "Course Schedule", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/course-schedule/", tags: ["graphs", "topo"] },
  { id: "dsa-081", title: "Course Schedule II", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/", tags: ["graphs", "topo"] },
  { id: "dsa-082", title: "Pacific Atlantic Water Flow", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 50, leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/", tags: ["graphs"] },
  { id: "dsa-083", title: "Graph Valid Tree", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 40, gfgUrl: "https://www.geeksforgeeks.org/problems/graph-is-tree-or-not/1", tags: ["graphs", "union-find"] },
  { id: "dsa-084", title: "Number of Connected Components", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 40, gfgUrl: "https://www.geeksforgeeks.org/problems/number-of-provinces/1", tags: ["graphs"] },
  { id: "dsa-085", title: "Word Ladder", category: "DSA", topic: "Graphs", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/word-ladder/", tags: ["graphs", "bfs"] },
  { id: "dsa-086", title: "Network Delay Time", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 50, leetcodeUrl: "https://leetcode.com/problems/network-delay-time/", tags: ["graphs", "dijkstra"] },
  { id: "dsa-087", title: "Cheapest Flights Within K Stops", category: "DSA", topic: "Graphs", difficulty: "MEDIUM", estimatedMinutes: 55, leetcodeUrl: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", tags: ["graphs"] },

  // DP
  { id: "dsa-088", title: "Climbing Stairs", category: "DSA", topic: "Dynamic Programming", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", tags: ["dp"] },
  { id: "dsa-089", title: "House Robber", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/house-robber/", tags: ["dp"] },
  { id: "dsa-090", title: "House Robber II", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/", tags: ["dp"] },
  { id: "dsa-091", title: "Coin Change", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/coin-change/", tags: ["dp"] },
  { id: "dsa-092", title: "Longest Increasing Subsequence", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", tags: ["dp"] },
  { id: "dsa-093", title: "Word Break", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/word-break/", tags: ["dp"] },
  { id: "dsa-094", title: "Combination Sum IV", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/combination-sum-iv/", tags: ["dp"] },
  { id: "dsa-095", title: "Unique Paths", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 30, leetcodeUrl: "https://leetcode.com/problems/unique-paths/", tags: ["dp"] },
  { id: "dsa-096", title: "Jump Game DP Review", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/jump-game/", tags: ["dp", "greedy"], isRevision: true },
  { id: "dsa-097", title: "Longest Common Subsequence", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/", tags: ["dp"] },
  { id: "dsa-098", title: "Edit Distance", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 50, leetcodeUrl: "https://leetcode.com/problems/edit-distance/", tags: ["dp"] },
  { id: "dsa-099", title: "Decode Ways", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/decode-ways/", tags: ["dp"] },
  { id: "dsa-100", title: "Partition Equal Subset Sum", category: "DSA", topic: "Dynamic Programming", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", tags: ["dp"] },

  // Trie
  { id: "dsa-101", title: "Implement Trie (Prefix Tree)", category: "DSA", topic: "Trie", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/", tags: ["trie"] },
  { id: "dsa-102", title: "Design Add and Search Words Data Structure", category: "DSA", topic: "Trie", difficulty: "MEDIUM", estimatedMinutes: 45, leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", tags: ["trie"] },
  { id: "dsa-103", title: "Word Search II", category: "DSA", topic: "Trie", difficulty: "HARD", estimatedMinutes: 60, leetcodeUrl: "https://leetcode.com/problems/word-search-ii/", tags: ["trie", "backtracking"] },

  // Intervals
  { id: "dsa-104", title: "Merge Intervals", category: "DSA", topic: "Intervals", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", tags: ["intervals"] },
  { id: "dsa-105", title: "Insert Interval", category: "DSA", topic: "Intervals", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/insert-interval/", tags: ["intervals"] },
  { id: "dsa-106", title: "Non-overlapping Intervals", category: "DSA", topic: "Intervals", difficulty: "MEDIUM", estimatedMinutes: 40, leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/", tags: ["intervals", "greedy"] },
  { id: "dsa-107", title: "Meeting Rooms II", category: "DSA", topic: "Intervals", difficulty: "MEDIUM", estimatedMinutes: 40, gfgUrl: "https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1", tags: ["intervals", "heap"] },

  // Bit Manipulation
  { id: "dsa-108", title: "Single Number", category: "DSA", topic: "Bit Manipulation", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/single-number/", tags: ["bits"] },
  { id: "dsa-109", title: "Number of 1 Bits", category: "DSA", topic: "Bit Manipulation", difficulty: "EASY", estimatedMinutes: 20, leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/", tags: ["bits"] },
  { id: "dsa-110", title: "Counting Bits", category: "DSA", topic: "Bit Manipulation", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/counting-bits/", tags: ["bits", "dp"] },
  { id: "dsa-111", title: "Reverse Bits", category: "DSA", topic: "Bit Manipulation", difficulty: "EASY", estimatedMinutes: 25, leetcodeUrl: "https://leetcode.com/problems/reverse-bits/", tags: ["bits"] },
  { id: "dsa-112", title: "Sum of Two Integers", category: "DSA", topic: "Bit Manipulation", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/", tags: ["bits"] },

  // Recursion
  { id: "dsa-113", title: "Pow(x, n)", category: "DSA", topic: "Recursion", difficulty: "MEDIUM", estimatedMinutes: 30, leetcodeUrl: "https://leetcode.com/problems/powx-n/", tags: ["recursion"] },
  { id: "dsa-114", title: "Generate Parentheses", category: "DSA", topic: "Recursion", difficulty: "MEDIUM", estimatedMinutes: 35, leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/", tags: ["recursion", "backtracking"] },
  { id: "dsa-115", title: "Fibonacci Number", category: "DSA", topic: "Recursion", difficulty: "EASY", estimatedMinutes: 15, leetcodeUrl: "https://leetcode.com/problems/fibonacci-number/", tags: ["recursion", "dp"] },
];
