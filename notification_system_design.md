# Campus Notifications Platform Design

## Stage 1: Priority Inbox Design

### 1. Priority Evaluation Formula
To compute and select the top 'n' most important unread notifications efficiently, each incoming notification is processed through a deterministic weight mapping. 

The sorting formula evaluates notifications using two criteria:
* **Category Weight ($W$):** A static numerical score maps each notification type:
  $$\text{Placement} \rightarrow 3, \quad \text{Result} \rightarrow 2, \quad \text{Event} \rightarrow 1$$
* **Timestamp Recency ($T$):** Unix epochs are derived from notification timestamps to parse time mathematically.

### 2. Sorting Algorithm Breakdown
When evaluating two notifications ($A$ and $B$):
1. **Compare Category Weights:** If $W_B > W_A$, notification $B$ is ranked higher. 
2. **Resolve Ties Using Recency:** If $W_B = W_A$, the algorithm evaluates timestamps. If $T_B > T_A$, notification $B$ is ranked higher.

### 3. Maintaining Efficiency
Sorting a dynamic array of size $N$ operates at **$\mathcal{O}(N \log N)$** time complexity. To fetch the Top 10 items efficiently, we slice the sorted array instantly in $\mathcal{O}(1)$ time.
