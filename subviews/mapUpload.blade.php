<!--  map upload panel   -->
@if(Auth::check())
        {!! Form::open(array('route' => 'pathfind_store', 'files' => true)) !!}
	    	Select image to upload<small>(it needs to be a square, of at least 10 by 10 pixels for accurate results)</small>:
			<input type="file" name="image" id="image">
			<input type="submit" value="Upload Image" name="submit">
		{!! Form::close() !!}
@else
	This feature is currently under development. Check back later to see more!<br>
	<b>Map uploads not available to non logged in users just yet.</b><br>
@endif

@if(isset($image))
	Recently uploaded image:<br><br>
	<img src="{{$image}}" style="width:100px; height:100px;">
@else 
	<h2>NO IMAGE SET</h2>
@endif
<!--  end map upload panel   -->