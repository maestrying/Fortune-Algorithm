//      ======== S E T   P O I N T S ========
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(a, b) {
        return (Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)));      // вычисляем расстояние между точек
    }
}



//      ======== E D G E ========
class Edge {
    constructor(s, a, b) {
        this.left = a;      // точка слева
        this.right = b;     // точка справа
        this.start = s;     // стартовая точка

        this.end = null     // конечная точка

        this.f = (b.x - a.x) / (a.y - b.y);
        this.g = s.y - this.f * s.x;
        this.direction = new Point(b.y-a.y, -(b.x - a.x));
        this.B = new Point(s.x+this.direction.x, s.y + this.direction.y);	// вторая точка прямой

        this.intersected = false;   // пересечение
        this.iCounted = false;      // подсчет
        
        this.neighbour = null;
    }
}



//      ======== E V E N T ========
class Event {
    constructor(p, pe) {
        this.point = p;
        this.pe = pe;
        this.y = p.y;
        this.key = Math.random()*10000000;

        this.arch = null;
        this.value = 0;
    }
    compare(other) {
        return((this.y > other.y) ? 1 : -1);
    }
}



//      ======== P A R A B O L A ========
class Parabola {
    constructor(s) {
        this.cEvent = null;
        this.parent = null;
        this._left = null;
        this._right = null;

        this.site = s;
	    this.isLeaf = (this.site != null);
    }
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }

    set left(p){
        this._left = p;
		p.parent = this;
    }
    set right(p){
        this._right = p;
		p.parent = this;
    }
}



//      ======== Q U E U E ========
class Queue {
    constructor() {
        this.q = new Array();
		this.i = 0;
    }
    enqueue(p) {
		this.q.push(p);
	}
    dequeue() {
		this.q.sort(sortOnY);
		return this.q.pop();
	}
    remove(e) {
		let index = -1;
		for (this.i = 0; this.i < this.q.length; this.i++) {
			if (this.q[this.i] == e) { index = this.i; break; }
		}
		this.q.splice(index, 1);
	}
    isEmpty() {
		return (this.q.length == 0);
	}
	clear(b) {
		this.q = [];
	}
}

function sortOnY(a, b) {
    return (a.y > b.y) ? 1 : -1;
}



//      ======== P O L Y G O N ========
class Polygon {
    constructor() {
        this.size = 0;
		this.vertices = [];
		this.first = null;
		this.last = null;
    }
    addRight(p) {
		this.vertices.push(p);
		++this.size;
		this.last = p;
		if (this.size == 1)
			this.first = p;
	}
    addLeft(p) {
		let vs = this.vertices;
		this.vertices = [p];
		for (let i = 0; i < vs.length; i++)
			this.vertices.push(vs[i]);

		++this.size;
		this.first = p;
		if (this.size == 1)
			this.last = p;
	}
}



//      ======== V O R O N O I ========
class Voronoi {
    constructor() {
        this.places = null;
        this.edges = null;
        this.cells = null;
        this.queue = new Queue;

        this.width = 0;
        this.heght = 0;
        this.root = null;
        this.ly = 0;
        this.lasty = 0;
        this.fp = null;
    }
    Compute(p, width, height) {
        if (p.length < 2)
            return [];

        this.root = null;
        this.places = p;
        this.edges = [];
        this.cells = [];
        this.width = width;
        this.height = height;

        this.queue.clear(true);

        for (i = 0; i < this.places.length; i++) {
            let ev = new Event(this.places[i], true);
            let cell = new Polygon();
            this.places[i].cell = cell;
            this.queue.enqueue(ev);
            this.cells.push(cell);
        }

        let lasty = Number.MAX_VALUE;
        let num = 0;
        while (!this.queue.isEmpty()) {
            let e = this.queue.dequeue();
            this.ly = e.point.y;
            if (e.pe)
                this.InsertParabola(e.point);
            else
                this.RemoveParabola(e);

            this.lasty = e.y;
        }
        this.FinishEdge(this.root);

        for (i = 0; i < this.edges.length; i++)
            if (this.edges[i].neighbour)
                this.edges[i].start = this.edges[i].neighbour.end;
    }
    GetEdges() {
        return this.edges;
    }
    GetCells() {
        return this.cells;
    }
    // M E T H O D S   F O R   W O R K   W I T H   T R E E -------
    InsertParabola(p) {
        if (!this.root) { this.root = new Parabola(p); this.fp = p; return; }

        if (this.root.isLeaf && this.root.site.y - p.y < 0.01) // 
        {
            this.root.isLeaf = false;
            this.root.left = new Parabola(this.fp);
            this.root.right = new Parabola(p);
            let s = new Point((p.x + this.fp.x) / 2, this.height);
            if (p.x > this.fp.x)
                this.root.edge = new Edge(s, this.fp, p);
            else
                this.root.edge = new Edge(s, p, this.fp);
            this.edges.push(this.root.edge);
            return;
        }

        let par = this.GetParabolaByX(p.x);

        if (par.cEvent) {
            this.queue.remove(par.cEvent);
            par.cEvent = null;
        }

        let start = new Point(p.x, this.GetY(par.site, p.x));

        let el = new Edge(start, par.site, p);
        let er = new Edge(start, p, par.site);

        el.neighbour = er;
        this.edges.push(el);

        par.edge = er;
        par.isLeaf = false;

        let p0 = new Parabola(par.site);
        let p1 = new Parabola(p);
        let p2 = new Parabola(par.site);

        par.right = p2;
        par.left = new Parabola();
        par.left.edge = el;

        par.left.left = p0;
        par.left.right = p1;

        this.CheckCircle(p0);
        this.CheckCircle(p2);
    }
    RemoveParabola(e) {
        let p1 = e.arch;

        let xl = this.GetLeftParent(p1);
        let xr = this.GetRightParent(p1);

        let p0 = this.GetLeftChild(xl);
        let p2 = this.GetRightChild(xr);

        if (p0.cEvent) { this.queue.remove(p0.cEvent); p0.cEvent = null; }
        if (p2.cEvent) { this.queue.remove(p2.cEvent); p2.cEvent = null; }

        let p = new Point(e.point.x, this.GetY(p1.site, e.point.x));


        if (p0.site.cell.last == p1.site.cell.first)
            p1.site.cell.addLeft(p);
        else
            p1.site.cell.addRight(p);

        p0.site.cell.addRight(p);
        p2.site.cell.addLeft(p);

        this.lasty = e.point.y;

        xl.edge.end = p;
        xr.edge.end = p;

        let higher;
        let par = p1;
        while (par != this.root) {
            par = par.parent;
            if (par == xl) { higher = xl; }
            if (par == xr) { higher = xr; }
        }

        higher.edge = new Edge(p, p0.site, p2.site);

        this.edges.push(higher.edge);

        let gparent = p1.parent.parent;
        if (p1.parent.left == p1) {
            if (gparent.left == p1.parent)
                gparent.left = p1.parent.right;
            else
                p1.parent.parent.right = p1.parent.right;
        }

        else {
            if (gparent.left == p1.parent)
                gparent.left = p1.parent.left;
            else
                gparent.right = p1.parent.left;
        }

        this.CheckCircle(p0);
        this.CheckCircle(p2);
    }
    FinishEdge(n) {
        let mx;
        if (n.edge.direction.x > 0.0) {
            mx = Math.max(this.width, n.edge.start.x + 10);
        }

        else {
            mx = Math.min(0.0, n.edge.start.x - 10);
        }
        n.edge.end = new Point(mx, n.edge.f * mx + n.edge.g);

        if (!n.left.isLeaf)
            this.FinishEdge(n.left);
        if (!n.right.isLeaf)
            this.FinishEdge(n.right);
    }
    GetXOfEdge(par, y) {
        let left = this.GetLeftChild(par);
        let right = this.GetRightChild(par);

        let p = left.site;
        let r = right.site;

        let dp = 2 * (p.y - y);
        let a1 = 1 / dp;
        let b1 = -2 * p.x / dp;
        let c1 = y + dp * 0.25 + p.x * p.x / dp;

        dp = 2 * (r.y - y);
        let a2 = 1 / dp;
        let b2 = -2 * r.x / dp;
        let c2 = y + dp * 0.25 + r.x * r.x / dp;

        let a = a1 - a2;
        let b = b1 - b2;
        let c = c1 - c2;

        if (a == 0)
            return -c / b;

        let disc = b * b - 4 * a * c;
        let x1 = (-b + Math.sqrt(disc)) / (2 * a);
        let x2 = (-b - Math.sqrt(disc)) / (2 * a);

        let ry;
        if (p.y < r.y)
            ry = Math.max(x1, x2);
        else
            ry = Math.min(x1, x2);

        return ry;
    }
    GetParabolaByX(xx) {
        let par = this.root;
        let x = 0;

        while (!par.isLeaf) {
            x = this.GetXOfEdge(par, this.ly);
            if (x > xx)
                par = par.left;
            else
                par = par.right;
        }
        return par;
    }
    GetY(p, x) {
        let dp = 2 * (p.y - this.ly);
        let b1 = -2 * p.x / dp;
        let c1 = this.ly + dp / 4 + p.x * p.x / dp;

        return (x * x / dp + b1 * x + c1);
    }
    CheckCircle(b) {
        let lp = this.GetLeftParent(b);
        let rp = this.GetRightParent(b);

        let a = this.GetLeftChild(lp);
        let c = this.GetRightChild(rp);

        if (!a || !c || a.site == c.site)
            return;

        let s = this.GetEdgeIntersection(lp.edge, rp.edge);
        if (!s)
            return;

        let d = Point.prototype.distance(a.site, s);
        //if(d > 5000) return;
        if (s.y - d >= this.ly)
            return;

        let e = new Event(new Point(s.x, s.y - d), false);

        b.cEvent = e;
        e.arch = b;
        this.queue.enqueue(e);
    }
    GetEdgeIntersection(a, b) {
        let I = GetLineIntersection(a.start, a.B, b.start, b.B);

        // wrong direction of edge
        let wd = (I.x - a.start.x) * a.direction.x < 0 || (I.y - a.start.y) * a.direction.y < 0
            || (I.x - b.start.x) * b.direction.x < 0 || (I.y - b.start.y) * b.direction.y < 0;

        if (wd)
            return null;
        return I;
    }
    GetLeft(n) {
        return this.GetLeftChild(this.GetLeftParent(n));
    }
    GetRight(n) {
        return this.GetRightChild(this.GetRightParent(n));
    }
    GetLeftParent(n) {
        let par = n.parent;
        let pLast = n;
        while (par.left == pLast) {
            if (!par.parent)
                return null;
            pLast = par; par = par.parent;
        }
        return par;
    }
    GetRightParent(n) {
        let par = n.parent;
        let pLast = n;
        while (par.right == pLast) {
            if (!par.parent)
                return null;
            pLast = par; par = par.parent;
        }
        return par;
    }
    GetLeftChild(n) {
        if (!n)
            return null;
        let par = n.left;
        while (!par.isLeaf)
            par = par.right;
        return par;
    }
    GetRightChild(n) {
        if (!n)
            return null;
        let par = n.right;
        while (!par.isLeaf)
            par = par.left;
        return par;
    }
}

function GetLineIntersection(a1, a2, b1, b2)
{			
	let dax = (a1.x-a2.x), dbx = (b1.x-b2.x);
	let day = (a1.y-a2.y), dby = (b1.y-b2.y);
			
	let Den = dax*dby - day*dbx;
	if (Den == 0) return null;	// parallel

	let A = (a1.x * a2.y - a1.y * a2.x);
	let B = (b1.x * b2.y - b1.y * b2.x);
		
	let I = new Point(0,0);
	I.x = ( A*dbx - dax*B ) / Den;
	I.y = ( A*dby - day*B ) / Den;
	
	return I;
}