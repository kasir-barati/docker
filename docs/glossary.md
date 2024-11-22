# Glossary

<dl>
  <dt id="rdbStandsForGlossary">
    <a href="#rdbStandsForGlossary">#</a>
    RDB
  </dt>
  <dd>Stands for Redis Database Backup.</dd>
  <dd>A file.</dd>
  <dd>
    A dump of all user data stored in an internal, compressed serialization format at a particular timestamp which is used for point-in-time recovery (recovery from a timestamp).
  </dd>
  <dd>Snapshot style persistence format</dd>
  <dt id="aofStandsForGlossary">
    <a href="#aofStandsForGlossary">#</a>
    AOF
  </dt>
  <dd>Stands for Append Only File.</dd>
  <dd>
     A persistence technique in which an
     <a href="#rdbStandsForGlossary">RDB</a>
     file is generated once, and all the data is appended to it as it comes.
  </dd>
  <dd>Change-log style persistent format.</dd>
  <dd>
    By default Redis saves snapshots of the dataset on disk, in a binary file called <code>dump.rdb</code>.
  </dd>
  <dt id="">
    <a href="#">#</a>
  </dt>
  <dd></dd>
</dl>
