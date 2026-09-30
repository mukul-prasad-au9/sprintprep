/**
 * Only include URLs we are confident about.
 * Prefer LeetCode when the slug matches a known problem; otherwise GFG; else null.
 * Never invent uncertain links.
 */

const LEETCODE_BY_SLUG: Record<string, string> = {
  "two-sum": "https://leetcode.com/problems/two-sum/",
  "3-sum": "https://leetcode.com/problems/3sum/",
  "4-sum": "https://leetcode.com/problems/4sum/",
  "valid-anagram": "https://leetcode.com/problems/valid-anagram/",
  "longest-common-prefix": "https://leetcode.com/problems/longest-common-prefix/",
  "move-zeros-to-end": "https://leetcode.com/problems/move-zeroes/",
  "remove-duplicates-from-sorted-array":
    "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
  "find-missing-number": "https://leetcode.com/problems/missing-number/",
  "maximum-consecutive-ones": "https://leetcode.com/problems/max-consecutive-ones/",
  "majority-element-i": "https://leetcode.com/problems/majority-element/",
  "majority-element-ii": "https://leetcode.com/problems/majority-element-ii/",
  "kadane's-algorithm": "https://leetcode.com/problems/maximum-subarray/",
  "next-permutation": "https://leetcode.com/problems/next-permutation/",
  "rotate-matrix-by-90-degrees": "https://leetcode.com/problems/rotate-image/",
  "print-the-matrix-in-spiral-manner":
    "https://leetcode.com/problems/spiral-matrix/",
  "pascals-triangle-i": "https://leetcode.com/problems/pascals-triangle/",
  "pascals-triangle-ii": "https://leetcode.com/problems/pascals-triangle-ii/",
  "longest-consecutive-sequence-in-an-array":
    "https://leetcode.com/problems/longest-consecutive-sequence/",
  "count-subarrays-with-given-sum":
    "https://leetcode.com/problems/subarray-sum-equals-k/",
  "search-insert-position": "https://leetcode.com/problems/search-insert-position/",
  "search-in-rotated-sorted-array-i":
    "https://leetcode.com/problems/search-in-rotated-sorted-array/",
  "search-in-rotated-sorted-array-2":
    "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
  "find-minimum-in-rotated-sorted-array":
    "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
  "single-element-in-sorted-array":
    "https://leetcode.com/problems/single-element-in-a-sorted-array/",
  "find-peak-element": "https://leetcode.com/problems/find-peak-element/",
  "median-of-2-sorted-arrays":
    "https://leetcode.com/problems/median-of-two-sorted-arrays/",
  "koko-eating-bananas": "https://leetcode.com/problems/koko-eating-bananas/",
  "aggressive-cows": "", // not on LC with this name — leave empty, use GFG below
  "pow(x,n)": "https://leetcode.com/problems/powx-n/",
  "generate-parentheses": "https://leetcode.com/problems/generate-parentheses/",
  "combination-sum": "https://leetcode.com/problems/combination-sum/",
  "combination-sum-ii": "https://leetcode.com/problems/combination-sum-ii/",
  "combination-sum-iii": "https://leetcode.com/problems/combination-sum-iii/",
  "subsets-i": "https://leetcode.com/problems/subsets/",
  "subsets-ii": "https://leetcode.com/problems/subsets-ii/",
  "word-search": "https://leetcode.com/problems/word-search/",
  "n-queen": "https://leetcode.com/problems/n-queens/",
  "letter-combinations-of-a-phone-number":
    "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
  "palindrome-partitioning":
    "https://leetcode.com/problems/palindrome-partitioning/",
  "sudoko-solver": "https://leetcode.com/problems/sudoku-solver/",
  "reverse-a-ll": "https://leetcode.com/problems/reverse-linked-list/",
  "detect-a-loop-in-ll": "https://leetcode.com/problems/linked-list-cycle/",
  "find-middle-of-linked-list":
    "https://leetcode.com/problems/middle-of-the-linked-list/",
  "merge-sorted-lists-":
    "https://leetcode.com/problems/merge-two-sorted-lists/",
  "remove-nth-node-from-the-back-of-the-ll":
    "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
  "add-two-numbers-in-ll": "https://leetcode.com/problems/add-two-numbers/",
  "lru-cache": "https://leetcode.com/problems/lru-cache/",
  "lfu-cache": "https://leetcode.com/problems/lfu-cache/",
  "trapping-rainwater": "https://leetcode.com/problems/trapping-rain-water/",
  "largest-rectangle-in-a-histogram":
    "https://leetcode.com/problems/largest-rectangle-in-histogram/",
  "sliding-window-maximum":
    "https://leetcode.com/problems/sliding-window-maximum/",
  "next-greater-element":
    "https://leetcode.com/problems/next-greater-element-i/",
  "asteroid-collision": "https://leetcode.com/problems/asteroid-collision/",
  "longest-substring-without-repeating-characters":
    "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  "max-consecutive-ones-iii":
    "https://leetcode.com/problems/max-consecutive-ones-iii/",
  "minimum-window-substring-":
    "https://leetcode.com/problems/minimum-window-substring/",
  "fruit-into-baskets": "https://leetcode.com/problems/fruit-into-baskets/",
  "longest-repeating-character-replacement":
    "https://leetcode.com/problems/longest-repeating-character-replacement/",
  "binary-subarrays-with-sum":
    "https://leetcode.com/problems/binary-subarrays-with-sum/",
  "climbing-stairs": "https://leetcode.com/problems/climbing-stairs/",
  "house-robber": "https://leetcode.com/problems/house-robber/",
  "grid-unique-paths": "https://leetcode.com/problems/unique-paths/",
  "unique-paths-ii": "https://leetcode.com/problems/unique-paths-ii/",
  "best-time-to-buy-and-sell-stock":
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  "best-time-to-buy-and-sell-stock-ii":
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
  "best-time-to-buy-and-sell-stock-iii":
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
  "best-time-to-buy-and-sell-stock-iv":
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
  "coin-change-ii": "https://leetcode.com/problems/coin-change-ii/",
  "minimum-coins": "https://leetcode.com/problems/coin-change/",
  "longest-increasing-subsequence":
    "https://leetcode.com/problems/longest-increasing-subsequence/",
  "longest-common-subsequence":
    "https://leetcode.com/problems/longest-common-subsequence/",
  "edit-distance": "https://leetcode.com/problems/edit-distance/",
  "number-of-islands": "https://leetcode.com/problems/number-of-islands/",
  "number-of-provinces": "https://leetcode.com/problems/number-of-provinces/",
  "flood-fill-algorithm": "https://leetcode.com/problems/flood-fill/",
  "rotten-oranges": "https://leetcode.com/problems/rotting-oranges/",
  "course-schedule-i": "https://leetcode.com/problems/course-schedule/",
  "course-schedule-ii": "https://leetcode.com/problems/course-schedule-ii/",
  "word-ladder-i": "https://leetcode.com/problems/word-ladder/",
  "word-ladder-ii": "https://leetcode.com/problems/word-ladder-ii/",
  "dijkstra's-algorithm": "",
  "cheapest-flight-within-k-stops":
    "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
  "inorder-traversal":
    "https://leetcode.com/problems/binary-tree-inorder-traversal/",
  "preorder-traversal":
    "https://leetcode.com/problems/binary-tree-preorder-traversal/",
  "postorder-traversal":
    "https://leetcode.com/problems/binary-tree-postorder-traversal/",
  "level-order-traversal":
    "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  "maximum-depth-in-bt":
    "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  "diameter-of-binary-tree":
    "https://leetcode.com/problems/diameter-of-binary-tree/",
  "lca-in-bt":
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
  "search-in-bst": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
  "validate binary search tree":
    "https://leetcode.com/problems/validate-binary-search-tree/",
  "check-if-a-tree-is-a-bst-or-not":
    "https://leetcode.com/problems/validate-binary-search-tree/",
  "k-th-largest-element-in-an-array":
    "https://leetcode.com/problems/kth-largest-element-in-an-array/",
  "implement-min-stack": "https://leetcode.com/problems/min-stack/",
  "balanced-paranthesis": "https://leetcode.com/problems/valid-parentheses/",
  "assign-cookies": "https://leetcode.com/problems/assign-cookies/",
  "lemonade-change": "https://leetcode.com/problems/lemonade-change/",
  "jump-game---i": "https://leetcode.com/problems/jump-game/",
  "non-overlapping-intervals":
    "https://leetcode.com/problems/non-overlapping-intervals/",
  "insert-interval": "https://leetcode.com/problems/insert-interval/",
  "candy": "https://leetcode.com/problems/candy/",
  "isomorphic-string": "https://leetcode.com/problems/isomorphic-strings/",
  "rotate-string": "https://leetcode.com/problems/rotate-string/",
  "sort-characters-by-frequency":
    "https://leetcode.com/problems/sort-characters-by-frequency/",
  "palindrome-check": "https://leetcode.com/problems/valid-palindrome/",
  "single-number---i": "https://leetcode.com/problems/single-number/",
  "single-number---ii": "https://leetcode.com/problems/single-number-ii/",
  "single-number---iii": "https://leetcode.com/problems/single-number-iii/",
  "sort-an-array-of-0's-1's-and-2's":
    "https://leetcode.com/problems/sort-colors/",
  "rearrange-array-elements-by-sign":
    "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
  "maximum-product-subarray-in-an-array":
    "https://leetcode.com/problems/maximum-product-subarray/",
  "reverse-pairs": "https://leetcode.com/problems/reverse-pairs/",
  "count-inversions": "",
  "find-the-repeating-and-missing-number":
    "https://leetcode.com/problems/set-mismatch/",
  "merge-two-sorted-arrays-without-extra-space":
    "https://leetcode.com/problems/merge-sorted-array/",
  "longest-subarray-with-sum-k": "",
  "count-subarrays-with-given-xor-k": "",
  "first-and-last-occurrence":
    "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
  "find-nth-root-of-a-number": "",
  "find-square-root-of-a-number":
    "https://leetcode.com/problems/sqrtx/",
  "find-the-smallest-divisor":
    "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
  "minimum-days-to-make-m-bouquets":
    "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
  "split-array---largest-sum":
    "https://leetcode.com/problems/split-array-largest-sum/",
  "search-in-a-2d-matrix":
    "https://leetcode.com/problems/search-a-2d-matrix/",
  "search-in-2d-matrix-ii":
    "https://leetcode.com/problems/search-a-2d-matrix-ii/",
  "find-peak-element-ii":
    "https://leetcode.com/problems/find-a-peak-element-ii/",
  "power-set": "https://leetcode.com/problems/subsets/",
  "check-if-ll-is-palindrome-or-not":
    "https://leetcode.com/problems/palindrome-linked-list/",
  "find-the-intersection-point-of-y-ll":
    "https://leetcode.com/problems/intersection-of-two-linked-lists/",
  "find-the-starting-point-in-ll":
    "https://leetcode.com/problems/linked-list-cycle-ii/",
  "reverse-ll-in-group-of-given-size-k":
    "https://leetcode.com/problems/reverse-nodes-in-k-group/",
  "rotate-a-ll": "https://leetcode.com/problems/rotate-list/",
  "sort-ll": "https://leetcode.com/problems/sort-list/",
  "clone-a-ll-with-random-and-next-pointer":
    "https://leetcode.com/problems/copy-list-with-random-pointer/",
  "delete-the-middle-node-in-ll":
    "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
  "next-greater-element---2":
    "https://leetcode.com/problems/next-greater-element-ii/",
  "sum-of-subarray-minimums":
    "https://leetcode.com/problems/sum-of-subarray-minimums/",
  "remove-k-digits": "https://leetcode.com/problems/remove-k-digits/",
  "stock-span-problem":
    "https://leetcode.com/problems/online-stock-span/",
  "number-of-substrings-containing-all-three-characters":
    "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
  "count-number-of-nice-subarrays":
    "https://leetcode.com/problems/count-number-of-nice-subarrays/",
  "valid-paranthesis-checker":
    "https://leetcode.com/problems/valid-parenthesis-string/",
  "check-if-two-trees-are-identical-or-not":
    "https://leetcode.com/problems/same-tree/",
  "check-for-balanced-binary-tree":
    "https://leetcode.com/problems/balanced-binary-tree/",
  "maximum-path-sum-":
    "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
  "check-for-symmetrical-bts":
    "https://leetcode.com/problems/symmetric-tree/",
  "zig-zag-or-spiral-traversal":
    "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
  "vertical-order-traversal":
    "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
  "construct-a-bt-from-preorder-and-inorder":
    "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
  "construct-a-bt-from-postorder-and-inorder":
    "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
  "serialize-and-de-serialize-bt":
    "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
  "delete-a-node-in-bst":
    "https://leetcode.com/problems/delete-node-in-a-bst/",
  "insert-a-given-node-in-bst":
    "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
  "lca-in-bst":
    "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
  "kth-smallest-and-largest-element-in-bst":
    "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
  "bst-iterator":
    "https://leetcode.com/problems/binary-search-tree-iterator/",
  "two-sum-in-bst":
    "https://leetcode.com/problems/two-sum-iv-input-is-a-bst/",
  "kth-largest-element-in-a-stream-of-running-integers":
    "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
  "surrounded-regions": "https://leetcode.com/problems/surrounded-regions/",
  "number-of-enclaves": "https://leetcode.com/problems/number-of-enclaves/",
  "bipartite-graph": "https://leetcode.com/problems/is-graph-bipartite/",
  "find-eventual-safe-states":
    "https://leetcode.com/problems/find-eventual-safe-states/",
  "path-with-minimum-effort":
    "https://leetcode.com/problems/path-with-minimum-effort/",
  "number-of-ways-to-arrive-at-destination":
    "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
  "accounts-merge": "https://leetcode.com/problems/accounts-merge/",
  "making-a-large-island":
    "https://leetcode.com/problems/making-a-large-island/",
  "most-stones-removed-with-same-row-or-column":
    "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
  "number-of-operations-to-make-network-connected":
    "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
  "frog-jump": "https://leetcode.com/problems/frog-jump-ii/",
  "partition-equal-subset-sum":
    "https://leetcode.com/problems/partition-equal-subset-sum/",
  "0-and-1-knapsack": "",
  "target-sum": "https://leetcode.com/problems/target-sum/",
  "unbounded-knapsack": "",
  "largest-divisible-subset":
    "https://leetcode.com/problems/largest-divisible-subset/",
  "longest-string-chain":
    "https://leetcode.com/problems/longest-string-chain/",
  "number-of-longest-increasing-subsequences":
    "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
  "longest-palindromic-subsequence":
    "https://leetcode.com/problems/longest-palindromic-subsequence/",
  "distinct-subsequences":
    "https://leetcode.com/problems/distinct-subsequences/",
  "wildcard-matching": "https://leetcode.com/problems/wildcard-matching/",
  "burst-balloons": "https://leetcode.com/problems/burst-balloons/",
  "palindrome-partitioning-ii-":
    "https://leetcode.com/problems/palindrome-partitioning-ii/",
  "maximum-xor-of-two-numbers-in-an-array":
    "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
  "shortest-palindrome":
    "https://leetcode.com/problems/shortest-palindrome/",
  "reverse-every-word-in-a-string":
    "https://leetcode.com/problems/reverse-words-in-a-string/",
  "count-and-say": "https://leetcode.com/problems/count-and-say/",
  "triangle": "https://leetcode.com/problems/triangle/",
  "minimum-falling-path-sum":
    "https://leetcode.com/problems/minimum-falling-path-sum/",
  "cherry-pickup-ii": "https://leetcode.com/problems/cherry-pickup-ii/",
  "best-time-to-buy-and-sell-stock-with-cooldown-and-transaction-fees":
    "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
};

const GFG_BY_SLUG: Record<string, string> = {
  "aggressive-cows":
    "https://www.geeksforgeeks.org/problems/aggressive-cows/1",
  "book-allocation-problem":
    "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1",
  "union-of-two-sorted-arrays":
    "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1",
  "intersection-of-two-sorted-arrays":
    "https://www.geeksforgeeks.org/problems/intersection-of-two-sorted-arrays-1587115620/1",
  "selection-sort":
    "https://www.geeksforgeeks.org/problems/selection-sort/1",
  "bubble-sort": "https://www.geeksforgeeks.org/problems/bubble-sort/1",
  "insertion-sorting":
    "https://www.geeksforgeeks.org/problems/insertion-sort/1",
  "merge-sorting": "https://www.geeksforgeeks.org/problems/merge-sort/1",
  "quick-sorting": "https://www.geeksforgeeks.org/problems/quick-sort/1",
  "leaders-in-an-array":
    "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1",
  "rat-in-a-maze":
    "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
  "m-coloring-problem":
    "https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1",
  "n-meetings-in-one-room":
    "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
  "job-sequencing-problem":
    "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
  "minimum-number-of-platforms-required-for-a-railway":
    "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
  "flattening-of-ll":
    "https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1",
  "detect-a-cycle-in-an-undirected-graph":
    "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1",
  "topological-sort-or-kahns-algorithm":
    "https://www.geeksforgeeks.org/problems/topological-sort/1",
  "bellman-ford-algorithm":
    "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1",
  "floyd-warshall-algorithm":
    "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1",
  "kosaraju's-algorithm":
    "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1",
  "count-inversions":
    "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115621/1",
  "longest-subarray-with-sum-k":
    "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1",
  "count-subarrays-with-given-xor-k":
    "https://www.geeksforgeeks.org/problems/subarray-with-given-xor/1",
  "find-nth-root-of-a-number":
    "https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1",
  "matrix-median":
    "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1",
  "find-row-with-maximum-1's":
    "https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1",
  "0-and-1-knapsack":
    "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
  "unbounded-knapsack":
    "https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1",
  "rod-cutting-problem":
    "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",
  "matrix-chain-multiplication":
    "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
  "alien-dictionary":
    "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
  "alient-dictionary":
    "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
  "shortest-path-in-dag":
    "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1",
  "disjoint-set-":
    "https://www.geeksforgeeks.org/problems/disjoint-set-union-find/1",
  "find-the-mst-weight":
    "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",
  "bridges-in-graph":
    "https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1",
  "articulation-point-in-graph":
    "https://www.geeksforgeeks.org/problems/articulation-point-1/1",
  "celebrity-problem":
    "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1",
  "shortest-job-first":
    "https://www.geeksforgeeks.org/problems/shortest-job-first/1",
  "kmp-algorithm-or-lps-array":
    "https://www.geeksforgeeks.org/problems/search-pattern-kmp-algorithm--141631/1",
  "rabin-karp-algorithm":
    "https://www.geeksforgeeks.org/problems/search-pattern-rabin-karp-algorithm--141631/1",
  "print-all-primes-till-n":
    "https://www.geeksforgeeks.org/problems/sieve-of-eratosthenes5246/1",
};

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/\s+/g, "-");
}

export function resolveProblemUrls(slug: string): {
  leetcodeUrl: string | null;
  gfgUrl: string | null;
} {
  const key = normalizeSlug(slug);
  const lc = LEETCODE_BY_SLUG[key];
  const gfg = GFG_BY_SLUG[key];
  return {
    leetcodeUrl: lc && lc.length > 0 ? lc : null,
    gfgUrl: gfg && gfg.length > 0 ? gfg : null,
  };
}
